from django.db import models
from django.utils import timezone

# Create your models here.
class ServerProvider(models.Model):
    provider_token = models.CharField(primary_key=True, max_length=36)
    name = models.CharField(max_length=40)
    color_normal = models.CharField(max_length=7)
    color_highlight = models.CharField(max_length=7)
    is_official = models.BooleanField(default=False)
    
class Server(models.Model):
    fingerprint = models.CharField(primary_key=True, max_length=36)
    port = models.PositiveIntegerField()
    provider = models.ForeignKey(ServerProvider, on_delete=models.CASCADE, null=True)
    tshock_version = models.CharField(max_length=20)
    terraria_version = models.CharField(max_length=20)
    is_legacy = models.BooleanField(default=False)
    last_updated = models.DateTimeField(default=timezone.now)
    
class ServerStats(models.Model):
    server = models.ForeignKey(Server, on_delete=models.CASCADE)
    cur_players = models.PositiveIntegerField()
    max_players = models.PositiveIntegerField()
    memory = models.BigIntegerField()
    added_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ('added_at',)
    
class ServerConfig(models.Model):
    server = models.ForeignKey(Server, on_delete=models.CASCADE)