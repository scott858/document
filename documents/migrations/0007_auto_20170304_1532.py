# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-03-04 20:32
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0006_auto_20170304_1531'),
    ]

    operations = [
        migrations.AlterField(
            model_name='nsdocument',
            name='document_format',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='documents.NsDocumentFormat'),
            preserve_default=False,
        ),
    ]
