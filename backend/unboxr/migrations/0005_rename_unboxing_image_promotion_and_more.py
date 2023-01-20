# Generated by Django 4.1.4 on 2022-12-30 18:24

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('unboxr', '0004_promotion_coupon_code_in_the_link_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='image',
            old_name='unboxing',
            new_name='promotion',
        ),
        migrations.RenameField(
            model_name='video',
            old_name='unboxing',
            new_name='promotion',
        ),
        migrations.RemoveField(
            model_name='promotion',
            name='coupon_code',
        ),
        migrations.AlterField(
            model_name='promotion',
            name='post_promotion_date',
            field=models.DateTimeField(default=datetime.datetime(2022, 12, 30, 13, 24, 4, 571469)),
        ),
        migrations.CreateModel(
            name='Coupon',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('coupon_code', models.CharField(blank=True, max_length=255, null=True)),
                ('date_modified', models.DateTimeField(auto_now=True)),
                ('date_published', models.DateTimeField(auto_now_add=True)),
                ('promotion', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='coupon', to='unboxr.promotion')),
            ],
        ),
    ]