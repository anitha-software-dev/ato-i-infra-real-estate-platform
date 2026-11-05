from django.db import close_old_connections, connection
import django.db.utils
import logging

logger = logging.getLogger(__name__)

class DatabaseConnectionMiddleware:
    """
    Ensures that broken, closed, or stale database connections are cleanly
    closed before each request, and transparently retries on connection loss.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        close_old_connections()
        try:
            return self.get_response(request)
        except (django.db.utils.InterfaceError, django.db.utils.OperationalError) as exc:
            logger.warning(f"Database connection error caught in middleware ({exc}). Reconnecting...")
            close_old_connections()
            try:
                connection.close()
            except Exception:
                pass
            return self.get_response(request)
        finally:
            close_old_connections()
