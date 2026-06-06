#!/bin/bash
# GrowUp — Start both backend and frontend servers

echo "🚀 Starting GrowUp Full Stack App..."
echo ""

# Start backend
echo "▶ Starting Django backend on :8000..."
cd backend
source venv/bin/activate 2>/dev/null || python -m venv venv && source venv/bin/activate
pip install -r requirements.txt -q
python manage.py migrate --run-syncdb -q
python manage.py shell < seed_data.py 2>/dev/null
python manage.py runserver &
BACKEND_PID=$!
cd ..

# Start frontend
echo "▶ Starting React frontend on :5173..."
cd frontend
npm install -q
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ GrowUp is running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo "   Admin:    http://localhost:8000/admin"
echo "   API:      http://localhost:8000/api/"
echo ""
echo "Press Ctrl+C to stop both servers."
echo ""

# Wait and cleanup
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Servers stopped.'" INT
wait
