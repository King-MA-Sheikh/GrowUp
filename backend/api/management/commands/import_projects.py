import json
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from api.models import Project

class Command(BaseCommand):
    help = 'Import 100+ projects from JSON file'

    def add_arguments(self, parser):
        parser.add_argument('json_file', type=str, help='Path to JSON file')

    def handle(self, *args, **options):
        file_path = options['json_file']
        
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                projects_data = json.load(file)
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f'File not found: {file_path}'))
            return
        except json.JSONDecodeError as e:
            self.stdout.write(self.style.ERROR(f'Invalid JSON: {e}'))
            return
        
        created_count = 0
        updated_count = 0
        
        for data in projects_data:
            # Create slug from title
            slug = slugify(data['title'])
            
            # Check if project already exists
            existing = Project.objects.filter(slug=slug).first()
            
            project_data = {
                'title': data['title'],
                'category': data.get('category', 'Web Development'),
                'short_description': data.get('short_description', ''),
                'description': data.get('description', ''),
                'tech_stack': data.get('tech_stack', []),
                'features': data.get('features', []),
                'challenges': data.get('challenges', ''),
                'solutions': data.get('solutions', ''),
                'results': data.get('results', ''),
                'status': data.get('status', 'completed'),
                'is_featured': data.get('is_featured', False),
                'order': data.get('order', 0),
                'live_url': data.get('live_url', ''),
                'github_url': data.get('github_url', ''),
                'client_name': data.get('client_name', ''),
                'client_review': data.get('client_review', ''),
                'client_rating': data.get('client_rating', 5),
                'completion_date': data.get('completion_date', None),
                # SEO fields - set to None to avoid null constraint
                'meta_title': data.get('meta_title', ''),
                'meta_description': data.get('meta_description', ''),
                'meta_keywords': data.get('meta_keywords', ''),
            }
            
            if existing:
                # Update existing project
                for key, value in project_data.items():
                    setattr(existing, key, value)
                existing.save()
                updated_count += 1
                self.stdout.write(self.style.WARNING(f'Updated: {data["title"]}'))
            else:
                # Create new project
                Project.objects.create(slug=slug, **project_data)
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'Created: {data["title"]}'))
        
        self.stdout.write(self.style.SUCCESS(
            f'\n✅ Import Complete!\n'
            f'   Created: {created_count} projects\n'
            f'   Updated: {updated_count} projects\n'
            f'   Total: {created_count + updated_count} projects'
        ))