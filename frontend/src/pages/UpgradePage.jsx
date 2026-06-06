import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle, Zap, Users, Database, 
  Cloud, Shield, BarChart3, Headphones, Globe,
  CreditCard, Calendar, Clock, Star, Award,
  Rocket, Sparkles, TrendingUp, Briefcase, Code2,
  Plus, Minus, X, Loader2, CreditCard as CreditCardIcon,
  Smartphone, Landmark, Lock, Upload, AlertTriangle,
  Copy, Check, Building, Mail, Phone as PhoneIcon,
  CircleCheckBig, QrCode
} from 'lucide-react';
import { getSubscriptionPlans, createSubscription } from '../utils/api';
import api from '../utils/api';
import toast from 'react-hot-toast';

function PricingCard({ plan, isAnnual, onSelect, isPopular, isExpanded, onToggleExpand }) {
  const features = plan.features || [];
  const price = isAnnual ? parseFloat(plan.price) * 10 : parseFloat(plan.price);
  const displayFeatures = isExpanded ? features : features.slice(0, 4);
  
  return (
    <div className={`relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
      isPopular ? 'ring-2 ring-blue-500 shadow-xl' : 'border border-gray-200 dark:border-gray-800'
    }`}>
      {isPopular && (
        <div className="absolute top-0 right-0">
          <div className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
            Most Popular
          </div>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-900 p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
          <div className="mt-4">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">₹{price}</span>
            <span className="text-gray-500 dark:text-gray-400">/{plan.billing_cycle === 'yearly' ? 'year' : 'month'}</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">per user + GST</p>
        </div>
        
        <ul className="space-y-3 mb-6">
          {displayFeatures.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 dark:text-gray-400">{feature}</span>
            </li>
          ))}
        </ul>
        
        {features.length > 4 && (
          <button
            onClick={onToggleExpand}
            className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 flex items-center justify-center gap-1"
          >
            {isExpanded ? (
              <>Show Less <Minus size={14} /></>
            ) : (
              <>Show {features.length - 4} More Features <Plus size={14} /></>
            )}
          </button>
        )}
        
        <button
          onClick={() => onSelect(plan)}
          className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
            isPopular
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

function FeatureSection() {
  const features = [
    { icon: Code2, title: 'Unlimited Projects', desc: 'Create and manage unlimited projects' },
    { icon: Users, title: 'Team Collaboration', desc: 'Invite team members to collaborate' },
    { icon: Database, title: 'Cloud Storage', desc: 'Secure cloud storage for your files' },
    { icon: Cloud, title: 'Cloud Deployment', desc: 'One-click deployment to cloud' },
    { icon: Shield, title: 'Enterprise Security', desc: 'Bank-grade security encryption' },
    { icon: BarChart3, title: 'Advanced Analytics', desc: 'Detailed insights and reports' },
    { icon: Headphones, title: 'Priority Support', desc: '24/7 priority customer support' },
    { icon: Globe, title: 'Custom Domain', desc: 'Use your own domain name' },
  ];
  
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
      {features.map((feature, idx) => (
        <div key={idx} className="text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
            <feature.icon size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{feature.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
        </div>
      ))}
    </div>
  );
}

function PaymentSuccessModal({ isOpen, onClose, subscription, plan }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full mx-4 p-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CircleCheckBig size={40} className="text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Payment Successful! 🎉
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Your payment for {plan.name} plan has been received successfully.
        </p>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⏳ Your subscription is pending admin approval. You will receive an email confirmation within 24 hours once your premium features are activated.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => {
              onClose();
              window.location.href = '/billing';
            }}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Go to Billing
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function CardPaymentForm({ amount, subscription, onSuccess, onError }) {
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    card_number: '',
    expiry_month: '',
    expiry_year: '',
    cvv: '',
    cardholder_name: ''
  });
  const [errors, setErrors] = useState({});

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ').slice(0, 19) : cleaned.slice(0, 16);
  };

  const validateCardNumber = (number) => {
    const cleaned = number.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cleaned)) return false;
    let sum = 0;
    let isEven = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'card_number') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!cardDetails.cardholder_name.trim()) {
      newErrors.cardholder_name = 'Cardholder name is required';
    }
    if (!cardDetails.card_number.trim()) {
      newErrors.card_number = 'Card number is required';
    } else if (cardDetails.card_number.replace(/\s/g, '').length !== 16) {
      newErrors.card_number = 'Card number must be 16 digits';
    } else if (!validateCardNumber(cardDetails.card_number)) {
      newErrors.card_number = 'Invalid card number';
    }
    if (!cardDetails.expiry_month) {
      newErrors.expiry_month = 'Expiry month required';
    }
    if (!cardDetails.expiry_year) {
      newErrors.expiry_year = 'Expiry year required';
    }
    if (!cardDetails.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway');
        setLoading(false);
        return;
      }
      
      // Initiate payment on backend
      console.log('Initiating payment for subscription:', subscription.id);
      
      const response = await api.post('/subscriptions/initiate_payment/', {
        subscription_id: subscription.id
      });
      
      console.log('Payment initiation response:', response.data);
      
      if (response.data.success) {
        const options = {
          key: response.data.key_id,
          amount: Math.round(amount * 100),
          currency: 'INR',
          name: 'GrowUp Technologies',
          description: `${subscription.plan_details?.name || 'Premium'} Plan Subscription`,
          order_id: response.data.order_id,
          prefill: {
            name: cardDetails.cardholder_name,
            email: subscription.user_email,
            contact: subscription.user_phone || '',
          },
          theme: {
            color: '#3B82F6'
          },
          handler: async function(response) {
            toast.loading('Verifying payment...', { id: 'payment' });
            
            try {
              const verifyResponse = await api.post('/subscriptions/verify_payment/', {
                subscription_id: subscription.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });
              
              if (verifyResponse.data.success) {
                toast.success('Payment successful! Awaiting admin approval.', { id: 'payment' });
                onSuccess();
              } else {
                toast.error('Payment verification failed', { id: 'payment' });
                onError?.('Payment verification failed');
              }
            } catch (error) {
              console.error('Verification error:', error);
              toast.error('Payment verification failed', { id: 'payment' });
              onError?.('Payment verification failed');
            }
            setLoading(false);
          },
          modal: {
            ondismiss: function() {
              setLoading(false);
              toast.info('Payment cancelled');
            }
          }
        };
        
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        toast.error(response.data.error || 'Failed to initiate payment');
        setLoading(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.error || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cardholder Name *</label>
        <input
          type="text"
          name="cardholder_name"
          value={cardDetails.cardholder_name}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          placeholder="John Doe"
        />
        {errors.cardholder_name && <p className="text-red-500 text-xs mt-1">{errors.cardholder_name}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Number *</label>
        <input
          type="text"
          name="card_number"
          value={cardDetails.card_number}
          onChange={handleInputChange}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white font-mono"
        />
        {errors.card_number && <p className="text-red-500 text-xs mt-1">{errors.card_number}</p>}
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Month</label>
          <select
            name="expiry_month"
            value={cardDetails.expiry_month}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          >
            <option value="">MM</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <option key={month} value={month.toString().padStart(2, '0')}>{month.toString().padStart(2, '0')}</option>
            ))}
          </select>
          {errors.expiry_month && <p className="text-red-500 text-xs mt-1">{errors.expiry_month}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Year</label>
          <select
            name="expiry_year"
            value={cardDetails.expiry_year}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          >
            <option value="">YY</option>
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
              <option key={year} value={year.toString().slice(-2)}>{year}</option>
            ))}
          </select>
          {errors.expiry_year && <p className="text-red-500 text-xs mt-1">{errors.expiry_year}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVV *</label>
          <input
            type="text"
            name="cvv"
            value={cardDetails.cvv}
            onChange={handleInputChange}
            placeholder="123"
            maxLength={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          />
          {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
        </div>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <><Loader2 size={18} className="animate-spin" /> Processing...</>
        ) : (
          <><CreditCardIcon size={18} /> Pay ₹{amount.toFixed(2)}</>
        )}
      </button>
    </form>
  );
}

function UPIPaymentForm({ amount, subscription, onSuccess, onError }) {
  const [copied, setCopied] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qrError, setQrError] = useState(false);
  
  const upiId = 'alkamahsheikh900@oksbi';
  // Fix: Use import.meta.env instead of process.env for Vite
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const qrCodeUrl = `${apiUrl}/media/upi-qr-code.png`;
  
  const copyUPIId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('UPI ID copied!');
  };
  
  const handleSubmit = async () => {
    if (!transactionId) {
      toast.error('Please enter transaction ID');
      return;
    }
    
    if (!selectedFile) {
      toast.error('Please upload payment screenshot');
      return;
    }
    
    setLoading(true);
    const formData = new FormData();
    formData.append('subscription_id', subscription.id);
    formData.append('transaction_id', transactionId);
    formData.append('upi_id', upiId);
    formData.append('payment_screenshot', selectedFile);
    
    try {
      await api.post(`/subscriptions/${subscription.id}/submit_manual_payment_proof/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Payment proof submitted! Admin will verify within 24 hours.');
      onSuccess();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'Failed to submit payment proof');
      onError?.('Failed to submit payment proof');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex justify-center mb-3">
          {!qrError ? (
            <img 
              src={qrCodeUrl} 
              alt="UPI QR Code"
              className="w-48 h-48 object-contain"
              onError={() => {
                setQrError(true);
                console.log('QR code failed to load from:', qrCodeUrl);
              }}
            />
          ) : (
            <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex flex-col items-center justify-center">
              <QrCode size={48} className="text-gray-400 mb-2" />
              <p className="text-xs text-gray-500">QR Code Unavailable</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 p-3 bg-white dark:bg-gray-900 rounded-lg border">
          <span className="font-mono text-sm">{upiId}</span>
          <button
            onClick={copyUPIId}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Send exact amount ₹{amount.toFixed(2)} to this UPI ID
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Transaction ID *</label>
        <input
          type="text"
          placeholder="Enter UPI transaction ID"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Screenshot *</label>
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
        />
        <p className="text-xs text-gray-500 mt-1">Upload screenshot of payment success page</p>
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <><Loader2 size={18} className="animate-spin" /> Submitting...</>
        ) : (
          <><Upload size={18} /> Submit Payment Proof</>
        )}
      </button>
    </div>
  );
}

function PaymentModal({ isOpen, onClose, subscription, plan, billingCycle, onSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const amount = billingCycle === 'yearly' ? parseFloat(plan.price) * 10 : parseFloat(plan.price);
  
  const handlePaymentSuccess = () => {
    setShowSuccess(true);
    onSuccess();
  };
  
  if (!isOpen) return null;
  
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Complete Payment</h2>
              <p className="text-sm text-gray-500 mt-1">Amount: ₹{amount.toFixed(2)}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6">
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600'
                }`}
              >
                <CreditCardIcon size={20} className="mx-auto mb-1" />
                <span className="text-sm">Card Payment</span>
              </button>
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600'
                }`}
              >
                <Smartphone size={20} className="mx-auto mb-1" />
                <span className="text-sm">UPI / QR</span>
              </button>
            </div>
            
            {paymentMethod === 'card' && (
              <CardPaymentForm
                amount={amount}
                subscription={subscription}
                onSuccess={handlePaymentSuccess}
                onError={(error) => console.error(error)}
              />
            )}
            
            {paymentMethod === 'upi' && (
              <UPIPaymentForm
                amount={amount}
                subscription={subscription}
                onSuccess={handlePaymentSuccess}
                onError={(error) => console.error(error)}
              />
            )}
          </div>
        </div>
      </div>
      
      <PaymentSuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          onClose();
        }}
        subscription={subscription}
        plan={plan}
      />
    </>
  );
}

export default function UpgradePage() {
  const [plans, setPlans] = useState([]);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [expandedPlans, setExpandedPlans] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company: '',
    agree_terms: false
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await getSubscriptionPlans();
      setPlans(response.data.results || response.data || []);
    } catch (err) {
      console.error('Error fetching plans:', err);
      toast.error('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (planId) => {
    setExpandedPlans(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowCheckout(true);
    setSubmitError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (submitError) setSubmitError(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Enter valid 10-digit phone number';
    if (!formData.agree_terms) newErrors.agree_terms = 'You must agree to the terms';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      const subscriptionData = {
        plan_id: selectedPlan.id,
        user_name: formData.full_name,
        user_email: formData.email,
        user_phone: formData.phone,
        company: formData.company,
        billing_cycle: billingCycle,
      };
      
      const response = await createSubscription(subscriptionData);
      
      if (response.data.success) {
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('userName', formData.full_name);
        
        setCurrentSubscription(response.data.data);
        setShowCheckout(false);
        setShowPayment(true);
        
        toast.success('Subscription created! Please complete payment.');
      } else {
        throw new Error('Subscription creation failed');
      }
    } catch (err) {
      console.error('Error:', err);
      let errorMessage = 'Subscription failed. ';
      if (err.response?.data?.errors) {
        errorMessage += Object.values(err.response.data.errors).flat().join(', ');
      } else if (err.response?.data?.error) {
        errorMessage += err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage += err.response.data.message;
      } else {
        errorMessage += 'Please try again.';
      }
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    console.log('Payment successful');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
            <Rocket size={14} className="text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Upgrade Your Experience</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose the <span className="text-blue-600 dark:text-blue-400">Perfect Plan</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Unlock premium features and take your projects to the next level
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Yearly <span className="text-green-600 dark:text-green-400">(Save 20%)</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isAnnual={billingCycle === 'yearly'}
              onSelect={handlePlanSelect}
              isPopular={plan.is_featured}
              isExpanded={expandedPlans[plan.id]}
              onToggleExpand={() => toggleExpand(plan.id)}
            />
          ))}
        </div>

        <FeatureSection />

        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Need a custom plan? <Link to="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">Contact our sales team</Link>
          </p>
        </div>
      </div>

      {showCheckout && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full mx-4">
            <div className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Complete Your Upgrade</h2>
              <button onClick={() => setShowCheckout(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">{selectedPlan.name} Plan</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    ₹{billingCycle === 'yearly' ? selectedPlan.price * 10 : selectedPlan.price}/{billingCycle === 'yearly' ? 'year' : 'month'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Billed {billingCycle === 'yearly' ? 'annually' : 'monthly'} + GST</p>
              </div>
              
              {submitError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {submitError}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    placeholder="John Doe"
                  />
                  {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      maxLength={10}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company (Optional)</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      placeholder="Your Company"
                    />
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    name="agree_terms"
                    checked={formData.agree_terms}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    I agree to the <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link to="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                  </label>
                </div>
                {errors.agree_terms && <p className="text-red-500 text-xs">{errors.agree_terms}</p>}
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <><Loader2 size={18} className="animate-spin" /> Creating Subscription...</>
                  ) : (
                    'Proceed to Payment'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {showPayment && currentSubscription && selectedPlan && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => {
            setShowPayment(false);
            window.location.href = '/billing';
          }}
          subscription={currentSubscription}
          plan={selectedPlan}
          billingCycle={billingCycle}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </main>
  );
}