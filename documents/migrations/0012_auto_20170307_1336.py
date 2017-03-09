# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-03-07 18:36
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0011_auto_20170307_1332'),
    ]

    operations = [
        migrations.AlterField(
            model_name='nsdocumentrevision',
            name='document',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='revisions', to='documents.NsDocument'),
        ),
    ]
