import json
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from api.models import Technology

class Command(BaseCommand):
    help = 'Import 500+ technologies from JSON file'

    def add_arguments(self, parser):
        parser.add_argument('json_file', type=str, help='Path to JSON file')

    def handle(self, *args, **options):
        file_path = options['json_file']
        
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                technologies_data = json.load(file)
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f'File not found: {file_path}'))
            return
        except json.JSONDecodeError as e:
            self.stdout.write(self.style.ERROR(f'Invalid JSON: {e}'))
            return
        
        created_count = 0
        updated_count = 0
        
        for data in technologies_data:
            # Generate slug from name
            name = data['name']
            slug = slugify(name)[:120]
            
            # Check if technology exists by name or slug
            tech, created = Technology.objects.update_or_create(
                name=name,
                defaults={
                    'slug': slug,
                    'category': data.get('category', ''),
                    'subcategory': data.get('subcategory', ''),
                    'icon': data.get('icon', '💻'),
                    'description': data.get('description', ''),
                    'long_description': data.get('long_description', ''),
                    'popularity': data.get('popularity', 50),
                    'is_active': data.get('is_active', True),
                    'order': data.get('order', 0),
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'Created: {tech.name} (slug: {tech.slug})'))
            else:
                updated_count += 1
                self.stdout.write(self.style.WARNING(f'Updated: {tech.name}'))
        
        self.stdout.write(self.style.SUCCESS(
            f'\n✅ Import Complete!\n'
            f'   Created: {created_count} technologies\n'
            f'   Updated: {updated_count} technologies\n'
            f'   Total: {created_count + updated_count} technologies'
        ))