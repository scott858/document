# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-03-09 00:59
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import django_extensions.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0015_auto_20170308_1723'),
    ]

    operations = [
        migrations.CreateModel(
            name='NsDocumentOldRevision',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('revision', models.PositiveIntegerField()),
                ('concise_description', models.CharField(max_length=63)),
                ('verbose_description', models.TextField(blank=True, default='')),
                ('filename', models.CharField(blank=True, max_length=255, unique=True)),
                ('filepath', models.FilePathField(match='//Nucleus-NAS1/Nucleus/PROJECTS/*', unique=True)),
                ('document', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='old_revisions', to='documents.NsDocument')),
                ('document_format', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='documents.NsDocumentFormat')),
                ('document_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='documents.NsDocumentType')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='documents.NsProject')),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='nsdocumentoldrevision',
            unique_together=set([('document', 'revision')]),
        ),
    ]