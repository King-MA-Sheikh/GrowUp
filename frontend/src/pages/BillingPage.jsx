import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, CreditCard, Calendar, Clock, Download, 
  FileText, CheckCircle, AlertCircle, XCircle,
  TrendingUp, Wallet, Receipt, Printer, Mail, Phone,
  MapPin, Building, User, DollarSign, CalendarDays,
  Plus, X, Loader2, CreditCard as CreditCardIcon,
  Landmark, Smartphone, Lock, Shield, Check, Upload,
  Clock as ClockIcon, AlertTriangle, Eye, Download as DownloadIcon
} from 'lucide-react';
import { getInvoices, cancelSubscription, addPaymentMethod, getPaymentMethods } from '../utils/api';
import api from '../utils/api';
import toast from 'react-hot-toast';

function InvoiceCard({ invoice }) {
  const statusColors = {
    paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    refunded: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  };
  
  const handleDownload = async () => {
    try {
      const response = await api.get(`/invoices/${invoice.id}/download/`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoice.invoice_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Invoice downloaded!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download invoice');
    }
  };
  
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${invoice.invoice_number}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { text-align: center; margin-bottom: 40px; }
            .details { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f5f5f5; }
            .total { text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>GrowUp Technologies</h1>
            <p>Invoice #${invoice.invoice_number}</p>
          </div>
          <div class="details">
            <p><strong>Customer:</strong> ${invoice.customer_name}</p>
            <p><strong>Email:</strong> ${invoice.customer_email}</p>
            <p><strong>Date:</strong> ${new Date(invoice.issue_date).toLocaleDateString()}</p>
          </div>
          <table>
            <thead>
              <tr><th>Description</th><th>Quantity</th><th>Unit Price</th><th>Total</th></tr>
            </thead>
            <tbody>
              ${invoice.items.map(item => `
                <tr>
                  <td>${item.name || item.description}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.unit_price}</td>
                  <td>₹${item.total}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            <p>Subtotal: ₹${invoice.amount}</p>
            <p>Tax (18%): ₹${invoice.tax}</p>
            <p>Total: ₹${invoice.total_amount}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };
  
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-500">{invoice.invoice_number}</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">₹{invoice.total_amount}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[invoice.status]}`}>
          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
        </span>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Calendar size={14} />
          <span>Issued: {new Date(invoice.issue_date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Clock size={14} />
          <span>Due: {new Date(invoice.due_date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <CreditCard size={14} />
          <span>{invoice.payment_method}</span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex gap-2">
        <button 
          onClick={handleDownload}
          className="flex-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-1"
        >
          <Download size={14} />
          PDF
        </button>
        <button 
          onClick={handlePrint}
          className="flex-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-1"
        >
          <Printer size={14} />
          Print
        </button>
      </div>
    </div>
  );
}

function PaymentDetailsModal({ payment, isOpen, onClose }) {
  if (!isOpen || !payment) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Payment Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Transaction ID:</span>
            <span className="font-mono text-sm">{payment.transaction_id || payment.razorpay_payment_id}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Amount:</span>
            <span className="font-bold">₹{payment.amount}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Payment Method:</span>
            <span>{payment.payment_method}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Status:</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              payment.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {payment.status}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Date:</span>
            <span>{new Date(payment.created_at).toLocaleString()}</span>
          </div>
          {payment.razorpay_order_id && (
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-mono text-xs">{payment.razorpay_order_id}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ActiveSubscriptionCard({ subscription, onCancel }) {
  const [cancelling, setCancelling] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  
  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      setCancelling(true);
      await onCancel(subscription.id);
      setCancelling(false);
    }
  };
  
  const viewPaymentDetails = async () => {
    try {
      const response = await api.get(`/subscriptions/${subscription.id}/payment_details/`);
      setPaymentDetails(response.data);
      setShowPaymentDetails(true);
    } catch (error) {
      console.error('Error fetching payment details:', error);
      toast.error('Failed to fetch payment details');
    }
  };
  
  return (
    <>
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{subscription.plan_details?.name || 'Premium Plan'}</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {subscription.plan_details?.billing_cycle === 'yearly' ? 'Annual' : 'Monthly'} subscription
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Active
          </span>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <CalendarDays size={16} />
            <span>Started: {new Date(subscription.start_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Clock size={16} />
            <span>Next billing: {new Date(subscription.end_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <DollarSign size={16} />
            <span>₹{subscription.plan_details?.price}/{subscription.plan_details?.billing_cycle === 'yearly' ? 'year' : 'month'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <TrendingUp size={16} />
            <span>Auto-renew: {subscription.auto_renew ? 'On' : 'Off'}</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={viewPaymentDetails}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Eye size={16} />
            Payment Details
          </button>
          <Link to="/upgrade" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            Upgrade Plan
          </Link>
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
          </button>
        </div>
      </div>
      
      <PaymentDetailsModal
        isOpen={showPaymentDetails}
        onClose={() => setShowPaymentDetails(false)}
        payment={paymentDetails}
      />
    </>
  );
}

function PendingSubscriptionCard({ subscription }) {
  const [uploading, setUploading] = useState(false);
  
  const handleUploadProof = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('payment_proof', file);
    formData.append('subscription_id', subscription.id);
    
    try {
      await api.post(`/subscriptions/${subscription.id}/upload_proof/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Payment proof uploaded successfully! Admin will verify soon.');
    } catch (error) {
      console.error('Error uploading proof:', error);
      toast.error('Failed to upload payment proof');
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{subscription.plan_details?.name || 'Premium Plan'}</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Payment Pending Verification
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
          Pending Approval
        </span>
      </div>
      
      <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertTriangle size={20} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⏳ Your payment is pending verification. Once verified by admin, your premium features will be activated.
          </p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <CalendarDays size={16} />
          <span>Requested: {new Date(subscription.created_at).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <DollarSign size={16} />
          <span>Amount: ₹{subscription.plan_details?.price}</span>
        </div>
        {subscription.razorpay_payment_id && (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <CreditCard size={16} />
            <span>Payment ID: {subscription.razorpay_payment_id.slice(-8)}</span>
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <label className="block">
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleUploadProof}
            disabled={uploading}
            className="hidden"
            id="payment-proof-upload"
          />
          <button
            onClick={() => document.getElementById('payment-proof-upload').click()}
            disabled={uploading}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Upload size={16} />
            )}
            {uploading ? 'Uploading...' : 'Upload Payment Proof'}
          </button>
        </label>
      </div>
    </div>
  );
}

function AddPaymentMethodModal({ isOpen, onClose, onSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    card_number: '',
    expiry_date: '',
    cvv: '',
    cardholder_name: '',
    upi_id: '',
    bank_name: '',
    account_number: '',
    account_holder: ''
  });
  const [errors, setErrors] = useState({});

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

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ').slice(0, 19) : cleaned.slice(0, 16);
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'card_number') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiry_date') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (paymentMethod === 'card') {
      if (!formData.cardholder_name.trim()) newErrors.cardholder_name = 'Cardholder name is required';
      if (!formData.card_number.trim()) newErrors.card_number = 'Card number is required';
      else if (formData.card_number.replace(/\s/g, '').length !== 16) newErrors.card_number = 'Card number must be 16 digits';
      else if (!validateCardNumber(formData.card_number)) newErrors.card_number = 'Invalid card number';
      if (!formData.expiry_date.trim()) newErrors.expiry_date = 'Expiry date is required';
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
      else if (!/^\d{3,4}$/.test(formData.cvv)) newErrors.cvv = 'CVV must be 3 or 4 digits';
    } else if (paymentMethod === 'upi') {
      if (!formData.upi_id.trim()) newErrors.upi_id = 'UPI ID is required';
      else if (!/^[\w.-]+@[\w.-]+$/.test(formData.upi_id)) newErrors.upi_id = 'Invalid UPI ID format';
    } else if (paymentMethod === 'bank') {
      if (!formData.bank_name.trim()) newErrors.bank_name = 'Bank name is required';
      if (!formData.account_number.trim()) newErrors.account_number = 'Account number is required';
      if (!formData.account_holder.trim()) newErrors.account_holder = 'Account holder name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        toast.error('Please login to add payment method');
        return;
      }
      
      const paymentData = {
        payment_type: paymentMethod,
        user_email: userEmail,
        ...formData
      };
      
      if (paymentMethod === 'card') {
        paymentData.card_last4 = formData.card_number.slice(-4);
        paymentData.card_brand = 'Visa';
        paymentData.card_expiry = formData.expiry_date;
        paymentData.cardholder_name = formData.cardholder_name;
      } else if (paymentMethod === 'upi') {
        paymentData.upi_id = formData.upi_id;
      } else if (paymentMethod === 'bank') {
        paymentData.bank_name = formData.bank_name;
        paymentData.account_number = formData.account_number;
        paymentData.account_holder = formData.account_holder;
      }
      
      await addPaymentMethod(paymentData);
      toast.success('Payment method added successfully');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error adding payment method:', err);
      setErrors({ submit: 'Failed to add payment method. Please try again.' });
      toast.error('Failed to add payment method');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add Payment Method</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`flex-1 py-3 rounded-lg border transition-colors ${
                paymentMethod === 'card'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              <CreditCardIcon size={20} className="mx-auto mb-1" />
              <span className="text-sm">Card</span>
            </button>
            <button
              onClick={() => setPaymentMethod('upi')}
              className={`flex-1 py-3 rounded-lg border transition-colors ${
                paymentMethod === 'upi'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              <Smartphone size={20} className="mx-auto mb-1" />
              <span className="text-sm">UPI</span>
            </button>
            <button
              onClick={() => setPaymentMethod('bank')}
              className={`flex-1 py-3 rounded-lg border transition-colors ${
                paymentMethod === 'bank'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              <Landmark size={20} className="mx-auto mb-1" />
              <span className="text-sm">Bank</span>
            </button>
          </div>
          
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {errors.submit}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardholder_name"
                    value={formData.cardholder_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                    placeholder="John Doe"
                  />
                  {errors.cardholder_name && <p className="text-red-500 text-xs mt-1">{errors.cardholder_name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Number</label>
                  <input
                    type="text"
                    name="card_number"
                    value={formData.card_number}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 font-mono"
                  />
                  {errors.card_number && <p className="text-red-500 text-xs mt-1">{errors.card_number}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      name="expiry_date"
                      value={formData.expiry_date}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                    />
                    {errors.expiry_date && <p className="text-red-500 text-xs mt-1">{errors.expiry_date}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                    />
                    {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            )}
            
            {paymentMethod === 'upi' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">UPI ID</label>
                <input
                  type="text"
                  name="upi_id"
                  value={formData.upi_id}
                  onChange={handleInputChange}
                  placeholder="username@okhdfcbank"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                />
                {errors.upi_id && <p className="text-red-500 text-xs mt-1">{errors.upi_id}</p>}
                <p className="text-xs text-gray-500 mt-1">Enter your UPI ID (e.g., username@bankname)</p>
              </div>
            )}
            
            {paymentMethod === 'bank' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bank Name</label>
                  <input
                    type="text"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                    placeholder="State Bank of India"
                  />
                  {errors.bank_name && <p className="text-red-500 text-xs mt-1">{errors.bank_name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Number</label>
                  <input
                    type="text"
                    name="account_number"
                    value={formData.account_number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                  />
                  {errors.account_number && <p className="text-red-500 text-xs mt-1">{errors.account_number}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    name="account_holder"
                    value={formData.account_holder}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                  />
                  {errors.account_holder && <p className="text-red-500 text-xs mt-1">{errors.account_holder}</p>}
                </div>
              </div>
            )}
            
            <div className="mt-6 flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <Shield size={16} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Your payment information is encrypted and secure.
              </p>
            </div>
            
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
              {submitting ? 'Adding...' : 'Add Payment Method'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPayment, setShowAddPayment] = useState(false);
  
  useEffect(() => {
    fetchBillingData();
  }, []);
  
  const fetchBillingData = async () => {
    setLoading(true);
    try {
      const userEmail = localStorage.getItem('userEmail');
      
      if (!userEmail) {
        console.log('No user email found');
        setLoading(false);
        return;
      }
      
      const [subResponse, invResponse, paymentResponse, transResponse] = await Promise.all([
        api.get('/subscriptions/', { params: { user_email: userEmail } }),
        getInvoices(),
        getPaymentMethods(),
        api.get('/payments/', { params: { user_email: userEmail } })
      ]);
      
      const subscriptions = subResponse.data.results || subResponse.data;
      const userSubscription = subscriptions && subscriptions.length > 0 ? subscriptions[0] : null;
      
      setSubscription(userSubscription);
      setInvoices(invResponse.data.results || invResponse.data || []);
      setPaymentMethods(paymentResponse.data.results || paymentResponse.data || []);
      setTransactions(transResponse.data.results || transResponse.data || []);
      
    } catch (err) {
      console.error('Error fetching billing data:', err);
      if (err.response?.status !== 404) {
        toast.error('Failed to load billing data');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancelSubscription = async (id) => {
    try {
      await cancelSubscription(id);
      toast.success('Subscription cancelled successfully');
      await fetchBillingData();
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      toast.error('Failed to cancel subscription');
    }
  };
  
  const handleAddPaymentMethod = async () => {
    await fetchBillingData();
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
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Billing & Subscription</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your subscription and billing information</p>
        </div>
        
        {subscription && subscription.status === 'pending_approval' && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Subscription Request</h2>
            <PendingSubscriptionCard subscription={subscription} />
          </div>
        )}
        
        {subscription && subscription.status === 'active' && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Current Subscription</h2>
            <ActiveSubscriptionCard subscription={subscription} onCancel={handleCancelSubscription} />
          </div>
        )}
        
        {!subscription && (
          <div className="mb-10 p-8 text-center bg-gray-100 dark:bg-gray-800 rounded-2xl">
            <Wallet size={48} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Active Subscription</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Upgrade to a premium plan to unlock features</p>
            <Link to="/upgrade" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              View Plans <ArrowRight size={16} />
            </Link>
          </div>
        )}
        
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Payment Methods</h2>
            <button
              onClick={() => setShowAddPayment(true)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <Plus size={14} />
              Add Payment Method
            </button>
          </div>
          
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
              <CreditCardIcon size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500 dark:text-gray-500">No payment methods added</p>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      {method.payment_type === 'card' ? (
                        <CreditCardIcon size={20} className="text-gray-600 dark:text-gray-400" />
                      ) : method.payment_type === 'upi' ? (
                        <Smartphone size={20} className="text-gray-600 dark:text-gray-400" />
                      ) : (
                        <Landmark size={20} className="text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {method.payment_type === 'card' 
                          ? `${method.card_brand || 'Card'} •••• ${method.card_last4}`
                          : method.payment_type === 'upi' 
                            ? `UPI: ${method.upi_id}`
                            : `${method.bank_name} - ${method.account_number?.slice(-4)}`
                        }
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {method.payment_type === 'card' 
                          ? `Expires ${method.card_expiry}`
                          : method.payment_type === 'upi' 
                            ? 'UPI ID'
                            : 'Bank Account'
                        }
                      </p>
                    </div>
                  </div>
                  {method.is_default && (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Default
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Billing History</h2>
          {invoices.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-500">
              <Receipt size={32} className="mx-auto text-gray-400 mb-2" />
              No invoices found
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {invoices.map((invoice) => (
                <InvoiceCard key={invoice.id} invoice={invoice} />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <AddPaymentMethodModal
        isOpen={showAddPayment}
        onClose={() => setShowAddPayment(false)}
        onSuccess={handleAddPaymentMethod}
      />
    </main>
  );
}