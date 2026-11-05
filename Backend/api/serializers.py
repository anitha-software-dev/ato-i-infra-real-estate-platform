from rest_framework import serializers
from .models import (
    User, Developer, Property, Event, Lead, Career,
    JobApplication, Content, Otp, ActivityLog, Testimonial, PropertySubmission
)


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'role', 'status', 'phone', 'lastLoginAt', 'createdAt', 'updatedAt', 'password']
        read_only_fields = ['id', 'createdAt', 'updatedAt']


class DeveloperSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Developer
        fields = ['id', 'name', 'logoUrl', 'slug']


class PropertySerializer(serializers.ModelSerializer):
    developer = DeveloperSimpleSerializer(source='developerId', read_only=True)
    developerId = serializers.CharField(source='developerId_id', required=True)
    price = serializers.CharField(source='priceRange', read_only=True)
    area = serializers.CharField(source='areaRangeSqFt', read_only=True)
    description = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    coverImage = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    priceRange = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    areaRangeSqFt = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    city = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    location = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    configurations = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    amenities = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    highlights = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    galleryImages = serializers.ListField(child=serializers.CharField(), required=False, default=list)

    class Meta:
        model = Property
        fields = [
            'id', 'name', 'slug', 'developerId', 'developer', 'type', 'city',
            'location', 'priceRange', 'areaRangeSqFt', 'price', 'area',
            'configurations', 'amenities', 'highlights', 'status', 'description',
            'coverImage', 'galleryImages', 'createdAt', 'updatedAt'
        ]
        read_only_fields = ['id', 'createdAt', 'updatedAt']


class DeveloperSerializer(serializers.ModelSerializer):
    properties = PropertySerializer(many=True, read_only=True)
    tagline = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    about = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    logoUrl = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    coverImageUrl = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    hqCity = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    operatingCities = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    awards = serializers.ListField(child=serializers.CharField(), required=False, default=list)

    class Meta:
        model = Developer
        fields = [
            'id', 'name', 'slug', 'tagline', 'about', 'foundedYear', 'hqCity',
            'operatingCities', 'experienceYears', 'completedProjects', 'ongoingProjects',
            'totalUnits', 'rating', 'reviewCount', 'logoUrl', 'coverImageUrl',
            'awards', 'status', 'properties', 'createdAt', 'updatedAt'
        ]
        read_only_fields = ['id', 'createdAt', 'updatedAt']


class EventSerializer(serializers.ModelSerializer):
    tagline = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    description = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    time = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    venueName = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    address = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    city = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    coverImage = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    registrationLink = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    galleryImages = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    highlights = serializers.ListField(child=serializers.CharField(), required=False, default=list)

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'slug', 'tagline', 'description', 'type', 'status',
            'startDate', 'endDate', 'time', 'venueName', 'address', 'city', 'mode',
            'coverImage', 'galleryImages', 'speakers', 'highlights', 'registrationLink',
            'attendees', 'createdAt', 'updatedAt'
        ]
        read_only_fields = ['id', 'createdAt', 'updatedAt']


class LeadSerializer(serializers.ModelSerializer):
    property = serializers.SerializerMethodField()
    event = serializers.SerializerMethodField()
    propertyId = serializers.CharField(source='propertyId_id', required=False, allow_null=True, allow_blank=True)
    eventId = serializers.CharField(source='eventId_id', required=False, allow_null=True, allow_blank=True)
    email = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    interest = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    purpose = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    location = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    budget = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    message = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = Lead
        fields = [
            'id', 'name', 'email', 'phone', 'source', 'status', 'propertyId', 'eventId',
            'property', 'event', 'interest', 'purpose', 'location', 'budget',
            'message', 'createdAt', 'updatedAt'
        ]
        read_only_fields = ['id', 'createdAt', 'updatedAt']

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        if 'propertyId' in data and not data['propertyId']:
            data['propertyId'] = None
        if 'eventId' in data and not data['eventId']:
            data['eventId'] = None
        return super().to_internal_value(data)

    def get_property(self, obj):
        if obj.propertyId_id:
            try:
                p = obj.propertyId
                return {'id': p.id, 'name': p.name, 'slug': p.slug}
            except Exception:
                return None
        return None

    def get_event(self, obj):
        if obj.eventId_id:
            try:
                e = obj.eventId
                return {'id': e.id, 'title': e.title, 'slug': e.slug}
            except Exception:
                return None
        return None


class CareerSerializer(serializers.ModelSerializer):
    salaryRange = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    responsibilities = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    requirements = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    niceToHave = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    benefits = serializers.ListField(child=serializers.CharField(), required=False, default=list)

    class Meta:
        model = Career
        fields = [
            'id', 'title', 'slug', 'department', 'location', 'type',
            'experienceLevel', 'salaryRange', 'isUrgent', 'description',
            'responsibilities', 'requirements', 'niceToHave', 'benefits',
            'status', 'postedDate', 'createdAt', 'updatedAt'
        ]
        read_only_fields = ['id', 'createdAt', 'updatedAt']


class JobApplicationSerializer(serializers.ModelSerializer):
    career = serializers.SerializerMethodField()
    careerId = serializers.CharField(source='careerId_id', required=False)
    linkedin = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    coverNote = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = JobApplication
        fields = [
            'id', 'careerId', 'career', 'name', 'email', 'phone', 'linkedin',
            'resumeUrl', 'coverNote', 'status', 'createdAt', 'updatedAt'
        ]
        read_only_fields = ['id', 'createdAt', 'updatedAt']

    def get_career(self, obj):
        if obj.careerId_id:
            try:
                c = obj.careerId
                return {
                    'id': c.id,
                    'title': c.title,
                    'department': c.department,
                    'location': c.location,
                    'slug': c.slug,
                }
            except Exception:
                return None
        return None


class ContentSerializer(serializers.ModelSerializer):
    excerpt = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    category = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    readTime = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    featuredImage = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = Content
        fields = [
            'id', 'title', 'slug', 'content', 'excerpt', 'category', 'readTime',
            'featuredImage', 'type', 'author', 'status', 'publishDate', 'views',
            'createdAt', 'updatedAt'
        ]
        read_only_fields = ['id', 'createdAt', 'updatedAt']


class OtpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Otp
        fields = ['id', 'phone', 'code', 'expiresAt', 'createdAt']
        read_only_fields = ['id', 'createdAt']


class ActivityLogSerializer(serializers.ModelSerializer):
    userId = serializers.CharField(source='userId_id', required=False, allow_null=True)
    details = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    ipAddress = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = ActivityLog
        fields = ['id', 'userId', 'userName', 'userEmail', 'action', 'details', 'ipAddress', 'createdAt']
        read_only_fields = ['id', 'createdAt']


class TestimonialSerializer(serializers.ModelSerializer):
    clientRole = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    clientAvatar = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    propertyName = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    location = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    quote = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = Testimonial
        fields = [
            'id', 'clientName', 'clientRole', 'clientAvatar', 'rating', 'quote',
            'propertyName', 'location', 'isFeatured', 'status', 'type',
            'createdAt', 'updatedAt'
        ]
        read_only_fields = ['id', 'createdAt', 'updatedAt']


class PropertySubmissionSerializer(serializers.ModelSerializer):
    ownerEmail = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    city = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    expectedPrice = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    areaSqFt = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    description = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    notes = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    assignedTo = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = PropertySubmission
        fields = [
            'id', 'ownerName', 'ownerEmail', 'ownerPhone', 'propertyType', 'purpose',
            'city', 'location', 'expectedPrice', 'areaSqFt', 'description',
            'status', 'notes', 'assignedTo', 'createdAt', 'updatedAt'
        ]
        read_only_fields = ['id', 'createdAt', 'updatedAt']
