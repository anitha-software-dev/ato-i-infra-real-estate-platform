import uuid
from django.db import models
from django.contrib.postgres.fields import ArrayField


def generate_uuid():
    return str(uuid.uuid4())


class User(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=generate_uuid, editable=False)
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True)
    passwordHash = models.CharField(max_length=255, db_column='passwordHash')
    role = models.CharField(max_length=50, default='USER')
    status = models.CharField(max_length=50, default='Active')
    phone = models.CharField(max_length=50, null=True, blank=True)
    lastLoginAt = models.DateTimeField(null=True, blank=True, db_column='lastLoginAt')
    createdAt = models.DateTimeField(auto_now_add=True, db_column='createdAt')
    updatedAt = models.DateTimeField(auto_now=True, db_column='updatedAt')

    class Meta:
        db_table = 'User'
        managed = True

    def __str__(self):
        return f"{self.name} ({self.email})"


class Developer(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=generate_uuid, editable=False)
    name = models.CharField(max_length=255)
    slug = models.CharField(max_length=255, unique=True)
    tagline = models.CharField(max_length=500)
    about = models.TextField()
    foundedYear = models.IntegerField(db_column='foundedYear')
    hqCity = models.CharField(max_length=255, db_column='hqCity')
    operatingCities = ArrayField(models.CharField(max_length=255), default=list, db_column='operatingCities')
    experienceYears = models.IntegerField(db_column='experienceYears')
    completedProjects = models.IntegerField(db_column='completedProjects')
    ongoingProjects = models.IntegerField(db_column='ongoingProjects')
    totalUnits = models.IntegerField(db_column='totalUnits')
    rating = models.FloatField(db_column='rating')
    reviewCount = models.IntegerField(db_column='reviewCount')
    logoUrl = models.TextField(db_column='logoUrl')
    coverImageUrl = models.TextField(db_column='coverImageUrl')
    awards = ArrayField(models.CharField(max_length=255), default=list, db_column='awards')
    status = models.CharField(max_length=50, default='Active')
    createdAt = models.DateTimeField(auto_now_add=True, db_column='createdAt')
    updatedAt = models.DateTimeField(auto_now=True, db_column='updatedAt')

    class Meta:
        db_table = 'Developer'
        managed = True

    def __str__(self):
        return self.name


class Property(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=generate_uuid, editable=False)
    name = models.CharField(max_length=255)
    slug = models.CharField(max_length=255, unique=True)
    developerId = models.ForeignKey(
        Developer,
        to_field='id',
        db_column='developerId',
        related_name='properties',
        on_delete=models.CASCADE
    )
    type = models.CharField(max_length=50)
    city = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    priceRange = models.CharField(max_length=255, db_column='priceRange')
    areaRangeSqFt = models.CharField(max_length=255, db_column='areaRangeSqFt')
    configurations = ArrayField(models.CharField(max_length=255), default=list, db_column='configurations')
    amenities = ArrayField(models.CharField(max_length=255), default=list, db_column='amenities')
    highlights = ArrayField(models.CharField(max_length=255), default=list, db_column='highlights')
    status = models.CharField(max_length=50)
    description = models.TextField()
    coverImage = models.TextField(db_column='coverImage')
    galleryImages = ArrayField(models.CharField(max_length=500), default=list, db_column='galleryImages')
    createdAt = models.DateTimeField(auto_now_add=True, db_column='createdAt')
    updatedAt = models.DateTimeField(auto_now=True, db_column='updatedAt')

    class Meta:
        db_table = 'Property'
        managed = True

    def __str__(self):
        return self.name


class Event(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=generate_uuid, editable=False)
    title = models.CharField(max_length=255)
    slug = models.CharField(max_length=255, unique=True)
    tagline = models.CharField(max_length=500)
    description = models.TextField()
    type = models.CharField(max_length=50)
    status = models.CharField(max_length=50)
    startDate = models.DateTimeField(db_column='startDate')
    endDate = models.DateTimeField(db_column='endDate')
    time = models.CharField(max_length=100)
    venueName = models.CharField(max_length=255, db_column='venueName')
    address = models.CharField(max_length=500)
    city = models.CharField(max_length=255)
    mode = models.CharField(max_length=50)
    coverImage = models.TextField(db_column='coverImage')
    galleryImages = ArrayField(models.CharField(max_length=500), default=list, db_column='galleryImages')
    speakers = models.JSONField(default=list)
    highlights = ArrayField(models.CharField(max_length=255), default=list, db_column='highlights')
    registrationLink = models.TextField(null=True, blank=True, db_column='registrationLink')
    attendees = models.IntegerField(default=0, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, db_column='createdAt')
    updatedAt = models.DateTimeField(auto_now=True, db_column='updatedAt')

    class Meta:
        db_table = 'Event'
        managed = True

    def __str__(self):
        return self.title


class Lead(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=generate_uuid, editable=False)
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, null=True, blank=True)
    phone = models.CharField(max_length=50)
    source = models.CharField(max_length=50)
    status = models.CharField(max_length=50, default='New')
    propertyId = models.ForeignKey(
        Property,
        to_field='id',
        db_column='propertyId',
        related_name='leads',
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )
    eventId = models.ForeignKey(
        Event,
        to_field='id',
        db_column='eventId',
        related_name='leads',
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )
    interest = models.CharField(max_length=255, null=True, blank=True)
    purpose = models.CharField(max_length=100, null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    budget = models.CharField(max_length=100, null=True, blank=True)
    message = models.TextField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, db_column='createdAt')
    updatedAt = models.DateTimeField(auto_now=True, db_column='updatedAt')

    class Meta:
        db_table = 'Lead'
        managed = True

    def __str__(self):
        return f"{self.name} ({self.phone})"


class Career(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=generate_uuid, editable=False)
    title = models.CharField(max_length=255)
    slug = models.CharField(max_length=255, unique=True)
    department = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    type = models.CharField(max_length=50)
    experienceLevel = models.CharField(max_length=100, db_column='experienceLevel')
    salaryRange = models.CharField(max_length=100, null=True, blank=True, db_column='salaryRange')
    isUrgent = models.BooleanField(default=False, db_column='isUrgent')
    description = models.TextField()
    responsibilities = ArrayField(models.TextField(), default=list, db_column='responsibilities')
    requirements = ArrayField(models.TextField(), default=list, db_column='requirements')
    niceToHave = ArrayField(models.TextField(), default=list, db_column='niceToHave')
    benefits = ArrayField(models.TextField(), default=list, db_column='benefits')
    status = models.CharField(max_length=50, default='Open')
    postedDate = models.DateTimeField(db_column='postedDate')
    createdAt = models.DateTimeField(auto_now_add=True, db_column='createdAt')
    updatedAt = models.DateTimeField(auto_now=True, db_column='updatedAt')

    class Meta:
        db_table = 'Career'
        managed = True

    def __str__(self):
        return self.title


class JobApplication(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=generate_uuid, editable=False)
    careerId = models.ForeignKey(
        Career,
        to_field='id',
        db_column='careerId',
        related_name='applications',
        on_delete=models.CASCADE
    )
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    phone = models.CharField(max_length=50)
    linkedin = models.CharField(max_length=500, null=True, blank=True)
    resumeUrl = models.TextField(db_column='resumeUrl')
    coverNote = models.TextField(null=True, blank=True, db_column='coverNote')
    status = models.CharField(max_length=50, default='Pending')
    createdAt = models.DateTimeField(auto_now_add=True, db_column='createdAt')
    updatedAt = models.DateTimeField(auto_now=True, db_column='updatedAt')

    class Meta:
        db_table = 'JobApplication'
        managed = True

    def __str__(self):
        return f"{self.name} - {self.careerId}"


class Content(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=generate_uuid, editable=False)
    title = models.CharField(max_length=255)
    slug = models.CharField(max_length=255, unique=True)
    content = models.TextField()
    excerpt = models.TextField(null=True, blank=True)
    category = models.CharField(max_length=100, null=True, blank=True)
    readTime = models.CharField(max_length=50, null=True, blank=True, db_column='readTime')
    featuredImage = models.TextField(null=True, blank=True, db_column='featuredImage')
    type = models.CharField(max_length=50)
    author = models.CharField(max_length=255)
    status = models.CharField(max_length=50, default='Draft')
    publishDate = models.DateTimeField(db_column='publishDate')
    views = models.IntegerField(default=0)
    createdAt = models.DateTimeField(auto_now_add=True, db_column='createdAt')
    updatedAt = models.DateTimeField(auto_now=True, db_column='updatedAt')

    class Meta:
        db_table = 'Content'
        managed = True

    def __str__(self):
        return self.title


class Otp(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=generate_uuid, editable=False)
    phone = models.CharField(max_length=50, unique=True)
    code = models.CharField(max_length=10)
    expiresAt = models.DateTimeField(db_column='expiresAt')
    createdAt = models.DateTimeField(auto_now_add=True, db_column='createdAt')

    class Meta:
        db_table = 'Otp'
        managed = True

    def __str__(self):
        return f"OTP for {self.phone}"


class ActivityLog(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=generate_uuid, editable=False)
    userId = models.ForeignKey(
        User,
        to_field='id',
        db_column='userId',
        related_name='activities',
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )
    userName = models.CharField(max_length=255, db_column='userName')
    userEmail = models.CharField(max_length=255, db_column='userEmail')
    action = models.CharField(max_length=100)
    details = models.TextField(null=True, blank=True)
    ipAddress = models.CharField(max_length=100, null=True, blank=True, db_column='ipAddress')
    createdAt = models.DateTimeField(auto_now_add=True, db_column='createdAt')

    class Meta:
        db_table = 'ActivityLog'
        managed = True

    def __str__(self):
        return f"{self.userName} - {self.action}"


class Testimonial(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=generate_uuid, editable=False)
    clientName = models.CharField(max_length=255, db_column='clientName')
    clientRole = models.CharField(max_length=255, null=True, blank=True, db_column='clientRole')
    clientAvatar = models.TextField(null=True, blank=True, db_column='clientAvatar')
    rating = models.IntegerField(default=5)
    quote = models.TextField()
    propertyName = models.CharField(max_length=255, null=True, blank=True, db_column='propertyName')
    location = models.CharField(max_length=255, null=True, blank=True)
    isFeatured = models.BooleanField(default=False, db_column='isFeatured')
    status = models.CharField(max_length=50, default='Active')
    type = models.CharField(max_length=50, default='CLIENT')
    createdAt = models.DateTimeField(auto_now_add=True, db_column='createdAt')
    updatedAt = models.DateTimeField(auto_now=True, db_column='updatedAt')

    class Meta:
        db_table = 'Testimonial'
        managed = True

    def __str__(self):
        return self.clientName


class PropertySubmission(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=generate_uuid, editable=False)
    ownerName = models.CharField(max_length=255, db_column='ownerName')
    ownerEmail = models.CharField(max_length=255, db_column='ownerEmail')
    ownerPhone = models.CharField(max_length=50, db_column='ownerPhone')
    propertyType = models.CharField(max_length=50, db_column='propertyType')
    purpose = models.CharField(max_length=50, default='Sell')
    city = models.CharField(max_length=255, null=True, blank=True)
    location = models.CharField(max_length=255)
    expectedPrice = models.CharField(max_length=100, null=True, blank=True, db_column='expectedPrice')
    areaSqFt = models.CharField(max_length=100, null=True, blank=True, db_column='areaSqFt')
    description = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=50, default='Pending_Review')
    notes = models.TextField(null=True, blank=True)
    assignedTo = models.CharField(max_length=255, null=True, blank=True, db_column='assignedTo')
    createdAt = models.DateTimeField(auto_now_add=True, db_column='createdAt')
    updatedAt = models.DateTimeField(auto_now=True, db_column='updatedAt')

    class Meta:
        db_table = 'PropertySubmission'
        managed = True

    def __str__(self):
        return f"{self.ownerName} - {self.location}"
