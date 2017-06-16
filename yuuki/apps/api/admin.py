from django.contrib import admin

from yuuki.apps.api.models import (
    ServerProvider,
    Server,
    ServerStats,
    ServerConfig
)

# Register your models here.
admin.site.register(ServerProvider)
admin.site.register(Server)
admin.site.register(ServerStats)
admin.site.register(ServerConfig)