# Generated by Django 2.1.7 on 2019-05-17 03:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rateMyCourse', '0002_teacherrankcache'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='profile_photo',
            field=models.URLField(blank=True, default='https://i.loli.net/2019/05/14/5cda6706c2f0861301.jpg'),
        ),
    ]
