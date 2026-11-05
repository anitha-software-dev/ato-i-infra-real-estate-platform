import json
from rest_framework.renderers import JSONRenderer


class EnvelopeJSONRenderer(JSONRenderer):
    """
    Ensures every response follows the standard envelope expected by Frontend & Admin Panel:
    Success: { "success": True, "data": ..., "message": ... }
    Error:   { "success": False, "message": ... }
    """

    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = renderer_context.get('response') if renderer_context else None
        status_code = response.status_code if response else 200

        # Check if already wrapped
        if isinstance(data, dict) and ('success' in data or 'status' in data):
            return super().render(data, accepted_media_type, renderer_context)

        if status_code >= 400:
            message = 'An error occurred'
            if isinstance(data, dict):
                if 'detail' in data:
                    message = str(data['detail'])
                elif 'message' in data:
                    message = str(data['message'])
                else:
                    first_val = next(iter(data.values()), None)
                    if isinstance(first_val, list) and len(first_val) > 0:
                        message = f"{next(iter(data.keys()))}: {first_val[0]}"
                    else:
                        message = str(first_val or message)
            elif isinstance(data, list) and len(data) > 0:
                message = str(data[0])

            wrapped_data = {
                'success': False,
                'message': message,
                'data': data
            }
        else:
            wrapped_data = {
                'success': True,
                'data': data
            }

        return super().render(wrapped_data, accepted_media_type, renderer_context)
