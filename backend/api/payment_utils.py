import razorpay
import hmac
import hashlib
from django.conf import settings
from decimal import Decimal

# Initialize Razorpay client
razorpay_client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)

def create_razorpay_order(amount, currency="INR", receipt=None):
    """Create a Razorpay order"""
    # Convert amount to paise (multiply by 100)
    amount_in_paise = int(amount * 100)
    
    order_data = {
        'amount': amount_in_paise,
        'currency': currency,
        'payment_capture': 1,  # Auto capture payment
        'receipt': receipt or f"order_{datetime.now().timestamp()}"
    }
    
    try:
        order = razorpay_client.order.create(data=order_data)
        return {
            'success': True,
            'order_id': order['id'],
            'amount': order['amount'],
            'currency': order['currency']
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def verify_razorpay_payment(order_id, payment_id, signature):
    """Verify Razorpay payment signature"""
    try:
        razorpay_client.utility.verify_payment_signature({
            'razorpay_order_id': order_id,
            'razorpay_payment_id': payment_id,
            'razorpay_signature': signature
        })
        return True
    except Exception:
        return False

def get_business_upi_details():
    """Get business UPI details for manual payment"""
    return {
        'upi_id': settings.BUSINESS_UPI_ID,
        'qr_code_url': '/media/upi-qr-code.png',
        'instructions': """
        Please send the exact amount to the UPI ID above.
        Use your registered email as payment reference.
        After payment, click 'I have made the payment' button.
        """
    }