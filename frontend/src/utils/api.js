import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5678/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============ AUTHENTICATION ============
export const registerUser = (data) => {
  const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
  return api.post('/auth/register/', data, { headers });
};

export const loginUser = (data) => api.post('/auth/login/', data);

export const logoutUser = () => api.post('/auth/logout/');

export const getCurrentUser = () => api.get('/auth/me/');

export const updateProfile = (data) => {
  const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
  return api.patch('/auth/update-profile/', data, { headers });
};

export const uploadProfilePhoto = (data) => api.post('/auth/upload-photo/', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// ============ PROJECTS ============
export const getProjects = (params = {}) => {
  const defaultParams = { page_size: 100, ...params };
  return api.get('/projects/', { params: defaultParams });
};
export const getProject = (slug) => api.get(`/projects/${slug}/`);
export const getRelatedProjects = (slug) => api.get(`/projects/${slug}/related/`);
export const getProjectStats = () => api.get('/projects/stats/');

// ============ SERVICES ============
export const getServices = () => api.get('/services/');

// ============ TESTIMONIALS ============
export const getTestimonials = () => api.get('/testimonials/');

// ============ TECH STACK ============
export const getTechStack = (params) => api.get('/tech-stack/', { params });

// ============ STATS ============
export const getStats = () => api.get('/stats/');

// ============ TECHNOLOGIES ============
export const getTechnologies = (params = {}) => {
  const defaultParams = { page_size: 100, ...params };
  return api.get('/technologies/', { params: defaultParams });
};
export const getTechnology = (slug) => api.get(`/technologies/${slug}/`);

// ============ TEAM MEMBERS / DEVELOPERS ============
export const getTeamMembers = (params = {}) => {
  const defaultParams = { page_size: 50, ...params };
  return api.get('/team-members/', { params: defaultParams });
};
export const getTeamMember = (slug) => api.get(`/team-members/${slug}/`);

// ============ MEETING REQUESTS ============
export const submitMeetingRequest = (data) => api.post('/meeting-requests/', data);

// ============ PROJECT REQUESTS ============
export const submitProjectRequest = (data) => api.post('/project-requests/', data);

// ============ PROBLEM REQUESTS ============
export const submitProblemRequest = (data) => api.post('/problem-requests/', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// ============ PROBLEMS ============
export const getProblems = (params = {}) => api.get('/problems/', { params });
export const getProblem = (id) => api.get(`/problems/${id}/`);
export const submitProblem = (data) => api.post('/problems/', data);
export const addProblemMessage = (id, data) => api.post(`/problems/${id}/add_message/`, data);
export const addProblemOffer = (id, data) => api.post(`/problems/${id}/add_offer/`, data);
export const acceptOffer = (id, offerId) => api.post(`/problems/${id}/accept_offer/`, { offer_id: offerId });

// ============ JOBS ============
export const getJobCategories = () => api.get('/job-categories/');
export const getJobs = (params = {}) => api.get('/jobs/', { params });
export const getJob = (slug) => api.get(`/jobs/${slug}/`);

// ============ JOB APPLICATIONS ============
export const applyForJob = (data) => api.post('/job-applications/', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getJobApplicationByEmail = (email) => api.get(`/job-applications/track/?email=${email}`);
export const updateApplicationStatus = (id, data) => api.patch(`/job-applications/${id}/update_status/`, data);

// ============ CONTACT ============
export const sendContact = (data) => api.post('/contact/', data);

// ============ SUBSCRIPTIONS & BILLING ============

// Subscription Plans
export const getSubscriptionPlans = (params = {}) => api.get('/subscription-plans/', { params });

// Subscriptions
export const getSubscriptions = (params = {}) => api.get('/subscriptions/', { params });
export const getSubscription = (email) => api.get('/subscriptions/', { 
    params: { user_email: email, status: 'active' } 
});
export const createSubscription = (data) => {
  return api.post('/subscriptions/', data);
};
export const updateSubscription = (id, data) => api.patch(`/subscriptions/${id}/`, data);
export const cancelSubscription = (id) => api.post(`/subscriptions/${id}/cancel/`);
export const reactivateSubscription = (id) => api.post(`/subscriptions/${id}/reactivate/`);

// Invoices
export const getInvoices = (params = {}) => api.get('/invoices/', { params });
export const getInvoice = (id) => api.get(`/invoices/${id}/`);
export const downloadInvoice = (id) => api.get(`/invoices/${id}/download/`, { responseType: 'blob' });

// Payment Methods
export const getPaymentMethods = () => api.get('/payment-methods/');
export const addPaymentMethod = (data) => api.post('/payment-methods/', data);
export const updatePaymentMethod = (id, data) => api.patch(`/payment-methods/${id}/`, data);
export const deletePaymentMethod = (id) => api.delete(`/payment-methods/${id}/`);
export const setDefaultPaymentMethod = (id) => api.post(`/payment-methods/${id}/set-default/`);

// Transactions
export const getTransactions = (params = {}) => api.get('/transactions/', { params });
export const getTransaction = (id) => api.get(`/transactions/${id}/`);

// Payment endpoints
export const initiatePayment = (subscriptionId) => api.post('/subscriptions/initiate_payment/', { subscription_id: subscriptionId });
export const verifyPayment = (data) => api.post('/subscriptions/verify_payment/', data);

export default api;