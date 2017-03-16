# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-03-16 14:12
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('documents', '0017_auto_20170310_0837'),
    ]

    operations = [
        migrations.AddField(
            model_name='nsdocumentoldrevision',
            name='created_by',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='nsdocumentformat',
            name='name',
            field=models.CharField(max_length=32, unique=True),
        ),
        migrations.AlterField(
            model_name='nsdocumentoldrevision',
            name='concise_description',
            field=models.CharField(max_length=64),
        ),
        migrations.AlterField(
            model_name='nsdocumentrevision',
            name='concise_description',
            field=models.CharField(max_length=64),
        ),
        migrations.AlterField(
            model_name='nsproject',
            name='name',
            field=models.CharField(max_length=64, unique=True),
        ),
    ]