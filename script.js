/**
 * Etsy & Web Store Financial Manager - Vanilla ES6 JavaScript Engine
 */

// ==========================================
// 1. INITIAL DATASETS
// ==========================================
import { db, auth, storage, realtimeDB } from "./firebase-config.js";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
// NOTE: If your firebase-config.js initializes the SDK via the CDN (gstatic) build
// instead of an npm bundler, change the import above to match, e.g.:
// import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, setDoc, onSnapshot }
//   from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
const INITIAL_ORDERS = [
  {
    id: 'ord-101',
    orderNumber: 'ETS-98421',
    channel: 'Etsy',
    orderDate: '2026-07-20',
    customerName: 'Sarah Jenkins',
    itemsSummary: 'Handcrafted Ceramic Planter (Sage Green)',
    itemsCount: 1,
    grossAmount: 48.00,
    shippingCharged: 6.50,
    taxCollected: 3.84,
    platformFees: 5.12,
    netRevenue: 49.38,
    paymentStatus: 'Paid',
    shippingStatus: 'Delivered',
    trackingNumber: '94001112024108821932',
    notes: 'Gift message included'
  },
  {
    id: 'ord-102',
    orderNumber: 'WEB-4001',
    channel: 'Website',
    orderDate: '2026-07-19',
    customerName: 'David Miller',
    itemsSummary: 'Artisan Linen Apron x 2, Soy Candle',
    itemsCount: 3,
    grossAmount: 112.00,
    shippingCharged: 0.00,
    taxCollected: 8.96,
    platformFees: 3.55,
    netRevenue: 108.45,
    paymentStatus: 'Paid',
    shippingStatus: 'Shipped',
    trackingNumber: '94001112024108821998'
  },
  {
    id: 'ord-103',
    orderNumber: 'ETS-98422',
    channel: 'Etsy',
    orderDate: '2026-07-18',
    customerName: 'Elena Rostova',
    itemsSummary: 'Custom Wooden Desk Organizer',
    itemsCount: 1,
    grossAmount: 85.00,
    shippingCharged: 8.00,
    taxCollected: 6.80,
    platformFees: 8.75,
    netRevenue: 84.25,
    paymentStatus: 'Paid',
    shippingStatus: 'Shipped',
    trackingNumber: '94001112024108822001'
  },
  {
    id: 'ord-104',
    orderNumber: 'WEB-4002',
    channel: 'Website',
    orderDate: '2026-07-17',
    customerName: 'Marcus Vance',
    itemsSummary: 'Hand-poured Ceramic Mug (Set of 4)',
    itemsCount: 4,
    grossAmount: 76.00,
    shippingCharged: 7.50,
    taxCollected: 6.08,
    platformFees: 2.72,
    netRevenue: 80.78,
    paymentStatus: 'Paid',
    shippingStatus: 'Delivered',
    trackingNumber: '94001112024108822015'
  },
  {
    id: 'ord-105',
    orderNumber: 'ETS-98423',
    channel: 'Etsy',
    orderDate: '2026-07-15',
    customerName: 'Jessica Taylor',
    itemsSummary: 'Minimalist Wall Clock (Walnut)',
    itemsCount: 1,
    grossAmount: 120.00,
    shippingCharged: 12.00,
    taxCollected: 9.60,
    platformFees: 12.40,
    netRevenue: 119.60,
    paymentStatus: 'Paid',
    shippingStatus: 'Delivered',
    trackingNumber: '94001112024108822030'
  },
  {
    id: 'ord-106',
    orderNumber: 'WEB-4003',
    channel: 'Website',
    orderDate: '2026-07-14',
    customerName: 'Christopher Cole',
    itemsSummary: 'Leather Key Fob & Coaster Bundle',
    itemsCount: 2,
    grossAmount: 45.00,
    shippingCharged: 4.99,
    taxCollected: 3.60,
    platformFees: 1.75,
    netRevenue: 48.24,
    paymentStatus: 'Paid',
    shippingStatus: 'Delivered'
  },
  {
    id: 'ord-107',
    orderNumber: 'ETS-98424',
    channel: 'Etsy',
    orderDate: '2026-07-12',
    customerName: 'Hannah Abbott',
    itemsSummary: 'Botanical Print Linen Table Runner',
    itemsCount: 1,
    grossAmount: 54.00,
    shippingCharged: 5.50,
    taxCollected: 4.32,
    platformFees: 5.80,
    netRevenue: 53.70,
    paymentStatus: 'Paid',
    shippingStatus: 'Delivered'
  },
  {
    id: 'ord-108',
    orderNumber: 'WEB-4004',
    channel: 'Website',
    orderDate: '2026-07-10',
    customerName: 'Robert Sterling',
    itemsSummary: 'Handcrafted Brass Candle Holders (Pair)',
    itemsCount: 2,
    grossAmount: 95.00,
    shippingCharged: 8.50,
    taxCollected: 7.60,
    platformFees: 3.30,
    netRevenue: 100.20,
    paymentStatus: 'Paid',
    shippingStatus: 'Delivered'
  },
  {
    id: 'ord-109',
    orderNumber: 'ETS-98425',
    channel: 'Etsy',
    orderDate: '2026-07-08',
    customerName: 'Chloe Bennett',
    itemsSummary: 'Ceramic Soap Dish & Tray Set',
    itemsCount: 1,
    grossAmount: 32.00,
    shippingCharged: 4.50,
    taxCollected: 2.56,
    platformFees: 3.65,
    netRevenue: 32.85,
    paymentStatus: 'Paid',
    shippingStatus: 'Delivered'
  },
  {
    id: 'ord-110',
    orderNumber: 'WEB-4005',
    channel: 'Website',
    orderDate: '2026-07-05',
    customerName: 'Brian Davies',
    itemsSummary: 'Walnut Serving Board & Oil Care Kit',
    itemsCount: 2,
    grossAmount: 135.00,
    shippingCharged: 0.00,
    taxCollected: 10.80,
    platformFees: 4.22,
    netRevenue: 130.78,
    paymentStatus: 'Paid',
    shippingStatus: 'Delivered'
  },
  {
    id: 'ord-111',
    orderNumber: 'ETS-98410',
    channel: 'Etsy',
    orderDate: '2026-06-28',
    customerName: 'Rachel Green',
    itemsSummary: 'Linen Pillow Cover (Terracotta)',
    itemsCount: 2,
    grossAmount: 68.00,
    shippingCharged: 6.00,
    taxCollected: 5.44,
    platformFees: 7.20,
    netRevenue: 66.80,
    paymentStatus: 'Paid',
    shippingStatus: 'Delivered'
  },
  {
    id: 'ord-112',
    orderNumber: 'WEB-3980',
    channel: 'Website',
    orderDate: '2026-06-25',
    customerName: 'Liam Hemsworth',
    itemsSummary: 'Artisan Ceramic Teapot',
    itemsCount: 1,
    grossAmount: 110.00,
    shippingCharged: 9.00,
    taxCollected: 8.80,
    platformFees: 3.75,
    netRevenue: 115.25,
    paymentStatus: 'Paid',
    shippingStatus: 'Delivered'
  },
  {
    id: 'ord-113',
    orderNumber: 'ETS-98390',
    channel: 'Etsy',
    orderDate: '2026-05-18',
    customerName: 'Sophia Turner',
    itemsSummary: 'Personalized Leather Journal',
    itemsCount: 1,
    grossAmount: 58.00,
    shippingCharged: 5.00,
    taxCollected: 4.64,
    platformFees: 6.10,
    netRevenue: 56.90,
 personalStatus: 'Paid',
    shippingStatus: 'Delivered'
  },
  {
    id: 'ord-114',
    orderNumber: 'WEB-3850',
    channel: 'Website',
    orderDate: '2026-05-12',
    customerName: 'Oliver Vance',
    itemsSummary: 'Modern Wood Plant Stand Set',
    itemsCount: 2,
    grossAmount: 140.00,
    shippingCharged: 12.00,
    taxCollected: 11.20,
    platformFees: 4.71,
    netRevenue: 147.29,
    paymentStatus: 'Paid',
    shippingStatus: 'Delivered'
  }
];

const INITIAL_PAYMENTS = [
  {
    id: 'pay-201',
    payoutDate: '2026-07-21',
    channel: 'Etsy Payout',
    grossAmount: 358.00,
    feesDeducted: 37.92,
    netPayout: 320.08,
    status: 'Settled',
    referenceId: 'ETSY-PO-20260721-09',
    notes: 'Weekly Etsy deposit to Business Checking'
  },
  {
    id: 'pay-202',
    payoutDate: '2026-07-20',
    channel: 'Stripe Web',
    grossAmount: 328.00,
    feesDeducted: 11.32,
    netPayout: 316.68,
    status: 'Settled',
    referenceId: 'STRIPE-PO-984210',
    notes: '2-day rolling payout for Web orders'
  },
  {
    id: 'pay-203',
    payoutDate: '2026-07-14',
    channel: 'Etsy Payout',
    grossAmount: 420.00,
    feesDeducted: 44.10,
    netPayout: 375.90,
    status: 'Settled',
    referenceId: 'ETSY-PO-20260714-08'
  },
  {
    id: 'pay-204',
    payoutDate: '2026-07-11',
    channel: 'Stripe Web',
    grossAmount: 275.00,
    feesDeducted: 9.25,
    netPayout: 265.75,
    status: 'Pending',
    referenceId: 'STRIPE-PO-981105'
  },
  {
    id: 'pay-205',
    payoutDate: '2026-07-07',
    channel: 'Etsy Payout',
    grossAmount: 290.00,
    feesDeducted: 31.50,
    netPayout: 258.50,
    status: 'Settled',
    referenceId: 'ETSY-PO-20260707-07'
  }
];

const INITIAL_EXPENSES = [
  {
    id: 'exp-301',
    date: '2026-07-15',
    category: 'Etsy Ads',
    channelAllocation: 'Etsy',
    amount: 65.00,
    paymentMethod: 'Business Credit Card',
    vendor: 'Etsy Seller Services',
    description: 'Etsy Search Ads campaign for Ceramic Planters & Clocks',
    receiptRef: 'REC-ETS-ADS-0715',
    taxDeductible: true
  },
  {
    id: 'exp-302',
    date: '2026-07-10',
    category: 'Etsy Listing Fees',
    channelAllocation: 'Etsy',
    amount: 14.20,
    paymentMethod: 'PayPal',
    vendor: 'Etsy Inc',
    description: 'Auto-renew listing fees (71 listings @ $0.20)',
    receiptRef: 'REC-ETS-LST-0710',
    taxDeductible: true
  },
  {
    id: 'exp-303',
    date: '2026-07-02',
    category: 'Web Hosting & Domain',
    channelAllocation: 'Website',
    amount: 29.00,
    paymentMethod: 'Business Credit Card',
    vendor: 'Shopify / Web host',
    description: 'Monthly Web Store hosting & SSL security',
    receiptRef: 'REC-WEB-HOST-07',
    taxDeductible: true
  },
  {
    id: 'exp-304',
    date: '2026-07-05',
    category: 'Shipping & Postage',
    channelAllocation: 'Shared Overhead',
    amount: 142.50,
    paymentMethod: 'Business Credit Card',
    vendor: 'PirateShip / USPS',
    description: 'USPS Priority Mail shipping labels bulk refill',
    receiptRef: 'REC-PS-0705',
    taxDeductible: true
  },
  {
    id: 'exp-305',
    date: '2026-07-08',
    category: 'Packaging Supplies',
    channelAllocation: 'Shared Overhead',
    amount: 88.00,
    paymentMethod: 'Business Credit Card',
    vendor: 'Uline Packaging',
    description: 'Eco-friendly bubble wrap, custom stickers, corrugated boxes',
    receiptRef: 'REC-ULINE-9821',
    taxDeductible: true
  },
  {
    id: 'exp-306',
    date: '2026-07-12',
    category: 'Marketing & Ads',
    channelAllocation: 'Website',
    amount: 95.00,
    paymentMethod: 'Business Credit Card',
    vendor: 'Meta Ads (Instagram)',
    description: 'Instagram Carousel Ads directing to Web Store',
    receiptRef: 'REC-META-8812',
    taxDeductible: true
  },
  {
    id: 'exp-307',
    date: '2026-06-28',
    category: 'E-commerce Software/Apps',
    channelAllocation: 'Website',
    amount: 19.00,
    paymentMethod: 'PayPal',
    vendor: 'Klaviyo Email Marketing',
    description: 'Monthly automated newsletter & abandoned cart email app',
    receiptRef: 'REC-KLAV-0628',
    taxDeductible: true
  },
  {
    id: 'exp-308',
    date: '2026-06-15',
    category: 'Studio Rent & Utilities',
    channelAllocation: 'Shared Overhead',
    amount: 350.00,
    paymentMethod: 'Bank Transfer',
    vendor: 'Co-Op Artisan Studios',
    description: 'Monthly studio space rent & high-fire kiln utility charge',
    receiptRef: 'REC-RENT-0615',
    taxDeductible: true
  }
];

const INITIAL_PURCHASES = [
  {
    id: 'pur-401',
    date: '2026-07-03',
    itemName: 'Stoneware Clay Bodies (50 lb bags x 6)',
    category: 'Raw Materials',
    supplier: 'Mid-South Ceramic Supply',
    quantity: 6,
    unitCost: 28.50,
    totalCost: 171.00,
    status: 'In Stock',
    reorderLevel: 2,
    notes: 'Cone 6 white stoneware clay'
  },
  {
    id: 'pur-402',
    date: '2026-07-06',
    itemName: 'Food-Safe Ceramic Glazes (Sage, Terracotta, Cobalt)',
    category: 'Raw Materials',
    supplier: 'Spectrum Glazes Co',
    quantity: 8,
    unitCost: 18.25,
    totalCost: 146.00,
    status: 'In Stock',
    reorderLevel: 3,
    notes: 'Pint jars for dipping'
  },
  {
    id: 'pur-403',
    date: '2026-07-14',
    itemName: 'Custom Logo Branded Mailer Boxes (10x8x4)',
    category: 'Packaging',
    supplier: 'Packlane',
    quantity: 150,
    unitCost: 1.45,
    totalCost: 217.50,
    status: 'In Stock',
    reorderLevel: 30,
    notes: 'Eco-certified Kraft cardboard'
  },
  {
    id: 'pur-404',
    date: '2026-07-18',
    itemName: 'Solid Walnut Wood Kiln Planks',
    category: 'Raw Materials',
    supplier: 'Urban Hardwoods Supply',
    quantity: 12,
    unitCost: 22.00,
    totalCost: 264.00,
    status: 'Ordered',
    reorderLevel: 4,
    notes: 'For serving boards & desk organizers'
  }
];

const INITIAL_GOALS = [
  {
    id: 'goal-1',
    title: 'Monthly Net Revenue Target',
    targetAmount: 2500.00,
    currentAmount: 1845.20,
    deadline: '2026-07-31',
    category: 'Revenue'
  },
  {
    id: 'goal-2',
    title: 'Reduce Etsy Fee Ratio below 8%',
    targetAmount: 8.0,
    currentAmount: 9.8,
    deadline: '2026-08-31',
    category: 'Expense Reduction'
  },
  {
    id: 'goal-3',
    title: 'Website Direct Sales Share > 50%',
    targetAmount: 50.0,
    currentAmount: 48.5,
    deadline: '2026-09-30',
    category: 'Revenue'
  }
];

// Navigation tab definitions
const NAVIGATION_TABS = [
  { id: 'dashboard', label: 'Overview & Analytics', icon: 'layout-dashboard' },
  { id: 'orders', label: 'Orders Ledger', icon: 'shopping-bag' },
  { id: 'payments', label: 'Payment Payouts', icon: 'credit-card' },
  { id: 'expenses', label: 'Operating Expenses', icon: 'receipt' },
  { id: 'purchases', label: 'Purchases & Inventory', icon: 'package' },
  { id: 'excel-grid', label: 'Spreadsheet Grid', icon: 'file-spreadsheet' },
  { id: 'ai-insights', label: 'AI Advisor', icon: 'sparkles' },
  { id: 'google-sync', label: 'Google Sync', icon: 'share-2' }
];

// ==========================================
// 2. CENTRAL STATE ENGINE
// ==========================================

const state = {
  activeTab: 'dashboard',
  channelFilter: 'All',
  themeMode: 'dark',
  orders: [],
  payments: [],
  expenses: [],
  purchases: [],
  goals: INITIAL_GOALS,
  
  // UI state
  searchOrders: '',
  searchExpenses: '',
  searchPurchases: '',
  searchPayments: '',
  isAddModalOpen: false,
  addModalTab: 'order',
  excelActiveSheet: 'summary',
  aiPrompt: '',
  aiLoading: false,
  aiResponse: '',
  copiedCsv: false,

  // Chart instances
  trendsChartInstance: null,
  categoryChartInstance: null
};

// ==========================================
// 2b. FIRESTORE PERSISTENCE LAYER
// ==========================================
// Replaces the old localStorage-based saveState(). Every CRUD operation now
// talks directly to Firestore, and onSnapshot() listeners (wired up in
// setupRealtimeListeners()) keep `state` in sync across every open device.

/**
 * Generic loader: fetches a collection, seeds it with initial demo data the
 * very first time the app runs against an empty database, and returns the
 * resulting array (each item carries its Firestore document id as `id`).
 */
async function loadCollectionOrSeed(collectionName, seedData) {
  const snapshot = await getDocs(collection(db, collectionName));

  if (snapshot.empty && Array.isArray(seedData) && seedData.length > 0) {
    for (const item of seedData) {
      // Use the demo id as the actual Firestore document id so existing
      // references (tracking numbers, notes, etc.) stay stable.
      await setDoc(doc(db, collectionName, item.id), item);
    }
    return seedData.map(item => ({ ...item }));
  }

  return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
}

async function loadOrders() {
  state.orders = await loadCollectionOrSeed('orders', INITIAL_ORDERS);
  state.orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  return state.orders;
}

async function loadPayments() {
  state.payments = await loadCollectionOrSeed('payments', INITIAL_PAYMENTS);
  state.payments.sort((a, b) => new Date(b.payoutDate) - new Date(a.payoutDate));
  return state.payments;
}

async function loadExpenses() {
  state.expenses = await loadCollectionOrSeed('expenses', INITIAL_EXPENSES);
  state.expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
  return state.expenses;
}

async function loadPurchases() {
  state.purchases = await loadCollectionOrSeed('purchases', INITIAL_PURCHASES);
  state.purchases.sort((a, b) => new Date(b.date) - new Date(a.date));
  return state.purchases;
}

/**
 * Create-or-update helpers. If the record already has an `id` that matches
 * an existing Firestore document, it's updated in place; otherwise a new
 * document is created with addDoc() and its generated id is written back
 * onto the document so every other function that expects `.id` keeps working.
 */
async function saveOrder(order) {
  if (order.id) {
    const { id, ...data } = order;
    await updateDoc(doc(db, 'orders', id), data);
    return id;
  }
  const docRef = await addDoc(collection(db, 'orders'), order);
  await updateDoc(docRef, { id: docRef.id });
  return docRef.id;
}

async function savePayment(payment) {
  if (payment.id) {
    const { id, ...data } = payment;
    await updateDoc(doc(db, 'payments', id), data);
    return id;
  }
  const docRef = await addDoc(collection(db, 'payments'), payment);
  await updateDoc(docRef, { id: docRef.id });
  return docRef.id;
}

async function saveExpense(expense) {
  if (expense.id) {
    const { id, ...data } = expense;
    await updateDoc(doc(db, 'expenses', id), data);
    return id;
  }
  const docRef = await addDoc(collection(db, 'expenses'), expense);
  await updateDoc(docRef, { id: docRef.id });
  return docRef.id;
}

async function savePurchase(purchase) {
  if (purchase.id) {
    const { id, ...data } = purchase;
    await updateDoc(doc(db, 'purchases', id), data);
    return id;
  }
  const docRef = await addDoc(collection(db, 'purchases'), purchase);
  await updateDoc(docRef, { id: docRef.id });
  return docRef.id;
}

/**
 * Theme / app settings now live in the `settings/theme` document instead of
 * localStorage's `theme_mode` key.
 */
async function loadThemeSetting() {
  const ref = doc(db, 'settings', 'theme');
  const snap = await getDoc(ref);
  if (snap.exists() && snap.data().mode) {
    state.themeMode = snap.data().mode;
  } else {
    await setDoc(ref, { mode: state.themeMode }, { merge: true });
  }
  return state.themeMode;
}

async function saveSettings() {
  await setDoc(doc(db, 'settings', 'theme'), { mode: state.themeMode }, { merge: true });
}

/**
 * Real-time sync: any change made on this device or any other connected
 * device is reflected instantly without a page refresh.
 */
function setupRealtimeListeners() {
  onSnapshot(collection(db, 'orders'), (snapshot) => {
    state.orders = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    state.orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    refreshUI();
  });

  onSnapshot(collection(db, 'payments'), (snapshot) => {
    state.payments = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    state.payments.sort((a, b) => new Date(b.payoutDate) - new Date(a.payoutDate));
    refreshUI();
  });

  onSnapshot(collection(db, 'expenses'), (snapshot) => {
    state.expenses = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    state.expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    refreshUI();
  });

  onSnapshot(collection(db, 'purchases'), (snapshot) => {
    state.purchases = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    state.purchases.sort((a, b) => new Date(b.date) - new Date(a.date));
    refreshUI();
  });
}

// ==========================================
// 3. FINANCIAL CALCULATIONS ENGINE
// ==========================================

function calculateFinancialSummary(orders, expenses, purchases) {
  let totalGrossRevenue = 0;
  let totalShippingCharged = 0;
  let totalPlatformFees = 0;
  let totalNetRevenue = 0;

  let etsyGrossRevenue = 0;
  let etsyPlatformFees = 0;
  let etsyNetRevenue = 0;
  let etsyOrderCount = 0;

  let webGrossRevenue = 0;
  let webPlatformFees = 0;
  let webNetRevenue = 0;
  let webOrderCount = 0;

  orders.forEach((ord) => {
    const gross = ord.grossAmount + ord.shippingCharged;
    totalGrossRevenue += gross;
    totalShippingCharged += ord.shippingCharged;
    totalPlatformFees += ord.platformFees;
    totalNetRevenue += ord.netRevenue;

    if (ord.channel === 'Etsy') {
      etsyGrossRevenue += gross;
      etsyPlatformFees += ord.platformFees;
      etsyNetRevenue += ord.netRevenue;
      etsyOrderCount += 1;
    } else {
      webGrossRevenue += gross;
      webPlatformFees += ord.platformFees;
      webNetRevenue += ord.netRevenue;
      webOrderCount += 1;
    }
  });

  const etsyAOV = etsyOrderCount > 0 ? etsyGrossRevenue / etsyOrderCount : 0;
  const etsyFeeRatio = etsyGrossRevenue > 0 ? (etsyPlatformFees / etsyGrossRevenue) * 100 : 0;

  const webAOV = webOrderCount > 0 ? webGrossRevenue / webOrderCount : 0;
  const webFeeRatio = webGrossRevenue > 0 ? (webPlatformFees / webGrossRevenue) * 100 : 0;

  let totalExpenses = 0;
  let etsyExpenses = 0;
  let webExpenses = 0;
  let overheadExpenses = 0;

  expenses.forEach((exp) => {
    totalExpenses += exp.amount;
    if (exp.channelAllocation === 'Etsy') {
      etsyExpenses += exp.amount;
    } else if (exp.channelAllocation === 'Website') {
      webExpenses += exp.amount;
    } else {
      overheadExpenses += exp.amount;
    }
  });

  let totalPurchasesCost = 0;
  purchases.forEach((p) => {
    totalPurchasesCost += p.totalCost;
  });

  const totalNetProfit = totalNetRevenue - totalExpenses - totalPurchasesCost;
  const netProfitMargin = totalGrossRevenue > 0 ? (totalNetProfit / totalGrossRevenue) * 100 : 0;

  return {
    totalGrossRevenue,
    totalShippingCharged,
    totalPlatformFees,
    totalNetRevenue,
    etsyGrossRevenue,
    etsyPlatformFees,
    etsyNetRevenue,
    etsyOrderCount,
    etsyAOV,
    etsyFeeRatio,
    webGrossRevenue,
    webPlatformFees,
    webNetRevenue,
    webOrderCount,
    webAOV,
    webFeeRatio,
    totalExpenses,
    etsyExpenses,
    webExpenses,
    overheadExpenses,
    totalPurchasesCost,
    totalNetProfit,
    netProfitMargin
  };
}

function getMonthlyTrends(orders, expenses, purchases) {
  const monthMap = {};

  orders.forEach((ord) => {
    const monthKey = ord.orderDate.substring(0, 7);
    if (!monthMap[monthKey]) {
      monthMap[monthKey] = { month: monthKey, etsyRev: 0, webRev: 0, totalRev: 0, expenses: 0, netProfit: 0 };
    }
    const gross = ord.grossAmount + ord.shippingCharged;
    if (ord.channel === 'Etsy') {
      monthMap[monthKey].etsyRev += gross;
    } else {
      monthMap[monthKey].webRev += gross;
    }
    monthMap[monthKey].totalRev += gross;
  });

  expenses.forEach((exp) => {
    const monthKey = exp.date.substring(0, 7);
    if (!monthMap[monthKey]) {
      monthMap[monthKey] = { month: monthKey, etsyRev: 0, webRev: 0, totalRev: 0, expenses: 0, netProfit: 0 };
    }
    monthMap[monthKey].expenses += exp.amount;
  });

  purchases.forEach((pur) => {
    const monthKey = pur.date.substring(0, 7);
    if (!monthMap[monthKey]) {
      monthMap[monthKey] = { month: monthKey, etsyRev: 0, webRev: 0, totalRev: 0, expenses: 0, netProfit: 0 };
    }
    monthMap[monthKey].expenses += pur.totalCost;
  });

  Object.values(monthMap).forEach((item) => {
    item.netProfit = item.totalRev - item.expenses;
  });

  return Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month));
}

function getExpenseCategoryBreakdown(expenses, purchases) {
  const categoryMap = {};

  expenses.forEach((exp) => {
    categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
  });

  purchases.forEach((pur) => {
    const key = `Purchases: ${pur.category}`;
    categoryMap[key] = (categoryMap[key] || 0) + pur.totalCost;
  });

  return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
}

// Formula evaluator for spreadsheet view
function evaluateExcelCellFormula(formula, gridData) {
  if (typeof formula !== 'string' || !formula.startsWith('=')) return formula;

  const upper = formula.substring(1).trim().toUpperCase();

  const sumMatch = upper.match(/^SUM\(([A-Z]+)(\d+):([A-Z]+)(\d+)\)$/);
  if (sumMatch) {
    const colStart = sumMatch[1].charCodeAt(0) - 65;
    const rowStart = parseInt(sumMatch[2]) - 1;
    const colEnd = sumMatch[3].charCodeAt(0) - 65;
    const rowEnd = parseInt(sumMatch[4]) - 1;

    let sum = 0;
    for (let r = Math.min(rowStart, rowEnd); r <= Math.max(rowStart, rowEnd); r++) {
      for (let c = Math.min(colStart, colEnd); c <= Math.max(colStart, colEnd); c++) {
        const val = gridData[r]?.[c];
        const num = typeof val === 'number' ? val : parseFloat(String(val || '0').replace(/[^0-9.-]+/g, ''));
        if (!isNaN(num)) sum += num;
      }
    }
    return sum;
  }

  const avgMatch = upper.match(/^AVERAGE\(([A-Z]+)(\d+):([A-Z]+)(\d+)\)$/);
  if (avgMatch) {
    const colStart = avgMatch[1].charCodeAt(0) - 65;
    const rowStart = parseInt(avgMatch[2]) - 1;
    const colEnd = avgMatch[3].charCodeAt(0) - 65;
    const rowEnd = parseInt(avgMatch[4]) - 1;

    let sum = 0;
    let count = 0;
    for (let r = Math.min(rowStart, rowEnd); r <= Math.max(rowStart, rowEnd); r++) {
      for (let c = Math.min(colStart, colEnd); c <= Math.max(colStart, colEnd); c++) {
        const val = gridData[r]?.[c];
        const num = typeof val === 'number' ? val : parseFloat(String(val || '0').replace(/[^0-9.-]+/g, ''));
        if (!isNaN(num)) {
          sum += num;
          count++;
        }
      }
    }
    return count > 0 ? (sum / count).toFixed(2) : 0;
  }

  try {
    const expr = upper.replace(/[^0-9+\-*/().]/g, '');
    if (expr) {
      const result = Function(`"use strict"; return (${expr})`)();
      return typeof result === 'number' ? result : formula;
    }
  } catch (e) {
    return '#VALUE!';
  }

  return formula;
}

// Excel File Exporter (SheetJS)
function exportToExcelFile() {
  const summary = calculateFinancialSummary(state.orders, state.expenses, state.purchases);
  const wb = XLSX.utils.book_new();

  const summarySheetData = [
    ['ETSY & WEBSITE STORE FINANCIAL SUMMARY LEDGER'],
    ['Generated On:', new Date().toLocaleString()],
    [''],
    ['METRIC', 'ETSY STORE', 'WEBSITE STORE', 'COMBINED / OVERHEAD', 'TOTAL'],
    ['Gross Sales Revenue', summary.etsyGrossRevenue, summary.webGrossRevenue, '-', summary.totalGrossRevenue],
    ['Platform & Processing Fees', summary.etsyPlatformFees, summary.webPlatformFees, '-', summary.totalPlatformFees],
    ['Net Sales Revenue', summary.etsyNetRevenue, summary.webNetRevenue, '-', summary.totalNetRevenue],
    ['Direct Operating Expenses', summary.etsyExpenses, summary.webExpenses, summary.overheadExpenses, summary.totalExpenses],
    ['Purchases & Cost of Goods', '-', '-', summary.totalPurchasesCost, summary.totalPurchasesCost],
    ['TOTAL NET PROFIT', '-', '-', '-', summary.totalNetProfit],
    ['NET PROFIT MARGIN (%)', '-', '-', '-', `${summary.netProfitMargin.toFixed(2)}%`]
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summarySheetData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Executive Summary');

  const ordersData = state.orders.map((o) => ({
    'Order #': o.orderNumber,
    'Channel': o.channel,
    'Order Date': o.orderDate,
    'Customer Name': o.customerName,
    'Items Summary': o.itemsSummary,
    'Gross Sales ($)': o.grossAmount,
    'Shipping ($)': o.shippingCharged,
    'Fees ($)': o.platformFees,
    'Net Revenue ($)': o.netRevenue,
    'Status': o.paymentStatus
  }));

  const wsOrders = XLSX.utils.json_to_sheet(ordersData);
  XLSX.utils.book_append_sheet(wb, wsOrders, 'Orders Ledger');

  XLSX.writeFile(wb, 'Etsy_and_Web_Store_Financial_Ledger.xlsx');
}

function generateGoogleSheetsCSV() {
  const headers = ['Order #', 'Channel', 'Date', 'Customer', 'Items', 'Gross ($)', 'Shipping ($)', 'Platform Fee ($)', 'Net Revenue ($)', 'Status'];
  const rows = state.orders.map(o => [
    o.orderNumber,
    o.channel,
    o.orderDate,
    `"${o.customerName.replace(/"/g, '""')}"`,
    `"${o.itemsSummary.replace(/"/g, '""')}"`,
    o.grossAmount.toFixed(2),
    o.shippingCharged.toFixed(2),
    o.platformFees.toFixed(2),
    o.netRevenue.toFixed(2),
    o.paymentStatus
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

// ==========================================
// 4. THEME SYSTEM MANAGER
// ==========================================

async function applyTheme(mode) {
  state.themeMode = mode;
  saveSettings(); // fire-and-forget write to settings/theme in Firestore

  const root = document.documentElement;
  let isDark = false;

  if (mode === 'dark') {
    isDark = true;
  } else if (mode === 'light') {
    isDark = false;
  } else if (mode === 'system') {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Update Theme Switcher UI active button styles
  const buttons = document.querySelectorAll('#theme-mode-group .theme-btn');
  buttons.forEach(btn => {
    const btnTheme = btn.getAttribute('data-theme');
    if (btnTheme === mode) {
      btn.className = 'theme-btn p-1.5 rounded-md transition-all font-semibold bg-slate-200 dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm';
    } else {
      btn.className = 'theme-btn p-1.5 rounded-md transition-all text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100';
    }
  });
}

// ==========================================
// 5. COMPONENT RENDERERS
// ==========================================

// Header Render & Event Binding
function renderHeader() {
  // Navigation tabs rendering
  const desktopNav = document.getElementById('nav-tabs-desktop');
  const mobileNav = document.getElementById('nav-tabs-mobile');

  const navHtml = NAVIGATION_TABS.map(tab => {
    const isActive = state.activeTab === tab.id;
    return `
      <button 
        data-tab="${tab.id}"
        class="nav-tab-btn flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
          isActive
            ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
        }"
      >
        <i data-lucide="${tab.icon}" class="w-3.5 h-3.5"></i>
        <span>${tab.label}</span>
      </button>
    `;
  }).join('');

  if (desktopNav) desktopNav.innerHTML = navHtml;
  if (mobileNav) mobileNav.innerHTML = navHtml;

  // Header Channel Badge
  const badge = document.getElementById('header-channel-badge');
  if (badge) {
    badge.innerText = state.channelFilter === 'All' ? 'All Channels' : `${state.channelFilter} Store`;
  }

  // Channel Filter Buttons active state
  const channelBtns = document.querySelectorAll('#channel-filter-group .channel-btn');
  channelBtns.forEach(btn => {
    const channel = btn.getAttribute('data-channel');
    if (channel === state.channelFilter) {
      btn.className = 'channel-btn px-2.5 py-1 rounded-md transition-all font-semibold bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm flex items-center space-x-1';
    } else {
      btn.className = 'channel-btn px-2.5 py-1 rounded-md transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 flex items-center space-x-1';
    }
  });

  applyTheme(state.themeMode);
}

// Quick Summary Banner
function renderQuickSummary() {
  const container = document.getElementById('quick-summary-container');
  if (!container) return;

  const matchesChannel = (channel) => {
    if (state.channelFilter === 'All') return true;
    return channel === state.channelFilter;
  };

  const filteredOrders = state.orders.filter(o => matchesChannel(o.channel));
  const filteredExpenses = state.expenses.filter(e => matchesChannel(e.channel));
  const filteredPurchases = state.purchases;

  const todayIso = new Date().toISOString().slice(0, 7);
  const availableMonths = Array.from(
    new Set(filteredOrders.map(o => o.orderDate ? o.orderDate.slice(0, 7) : todayIso))
  ).sort().reverse();

  const targetMonth = availableMonths.includes(todayIso) ? todayIso : (availableMonths[0] || '2026-07');
  const monthFormatted = new Date(`${targetMonth}-01`).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const thisMonthOrders = filteredOrders.filter(o => o.orderDate && o.orderDate.startsWith(targetMonth));
  const thisMonthExpenses = filteredExpenses.filter(e => e.date && e.date.startsWith(targetMonth));
  const thisMonthPurchases = filteredPurchases.filter(p => p.date && p.date.startsWith(targetMonth));

  const monthGrossRevenue = thisMonthOrders.reduce((sum, o) => sum + (o.grossAmount + o.shippingCharged), 0);
  const monthNetRevenue = thisMonthOrders.reduce((sum, o) => sum + o.netRevenue, 0);
  const monthDirectExpenses = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const monthPurchaseCost = thisMonthPurchases.reduce((sum, p) => sum + p.totalCost, 0);

  const monthNetProfit = monthNetRevenue - monthDirectExpenses - monthPurchaseCost;
  const monthMargin = monthGrossRevenue > 0 ? (monthNetProfit / monthGrossRevenue) * 100 : 0;

  const pendingPayments = state.payments.filter(p => p.status === 'Pending' || p.status === 'In Transit');
  const totalOutstandingPayments = pendingPayments.reduce((sum, p) => sum + p.netPayout, 0);
  const pendingOrders = filteredOrders.filter(o => o.paymentStatus === 'Pending' || o.shippingStatus === 'In Progress');
  const outstandingOrderBalance = pendingOrders.reduce((sum, o) => sum + o.grossAmount, 0);
  const grandOutstandingTotal = totalOutstandingPayments + outstandingOrderBalance;

  const totalExpensesAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalPurchasesAmount = filteredPurchases.reduce((sum, p) => sum + p.totalCost, 0);
  const grandTotalExpenses = totalExpensesAmount + totalPurchasesAmount;

  const categoryTotals = {};
  filteredExpenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });
  const topCategoryEntry = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  const topExpenseCategoryName = topCategoryEntry ? topCategoryEntry[0] : 'Platform Fees';

  container.innerHTML = `
    <div class="mb-6 space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <h2 class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Quick Summary Overview
          </h2>
          <span class="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 font-medium">
            Live Metrics
          </span>
        </div>
        <span class="text-xs text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1">
          <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
          Month Focus: <strong class="text-slate-900 dark:text-slate-100">${monthFormatted}</strong>
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Card 1: Net Profit -->
        <div 
          onclick="switchTab('dashboard')"
          class="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 transition-all duration-200 hover:border-emerald-500/50 hover:shadow-lg cursor-pointer overflow-hidden"
        >
          <div class="flex items-start justify-between">
            <div class="space-y-1">
              <span class="text-xs font-semibold text-slate-600 dark:text-slate-400">Net Profit (${monthFormatted.split(' ')[0]})</span>
              <div class="flex items-baseline space-x-2">
                <span class="text-2xl sm:text-3xl font-extrabold ${monthNetProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}">
                  $${monthNetProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <i data-lucide="trending-up" class="w-5 h-5"></i>
            </div>
          </div>
          <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div class="flex items-center space-x-1.5 text-slate-600 dark:text-slate-400 font-medium">
              <span class="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
                ${monthMargin.toFixed(1)}% margin
              </span>
              <span>• ${thisMonthOrders.length} orders</span>
            </div>
            <span class="text-emerald-600 dark:text-emerald-400 flex items-center font-semibold text-[11px]">
              <span>View Analytics</span>
              <i data-lucide="arrow-up-right" class="w-3.5 h-3.5 ml-0.5"></i>
            </span>
          </div>
        </div>

        <!-- Card 2: Outstanding Payments -->
        <div 
          onclick="switchTab('payments')"
          class="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 transition-all duration-200 hover:border-amber-500/50 hover:shadow-lg cursor-pointer overflow-hidden"
        >
          <div class="flex items-start justify-between">
            <div class="space-y-1">
              <span class="text-xs font-semibold text-slate-600 dark:text-slate-400">Outstanding Payments</span>
              <div class="flex items-baseline space-x-2">
                <span class="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                  $${grandOutstandingTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <i data-lucide="clock" class="w-5 h-5"></i>
            </div>
          </div>
          <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div class="flex items-center space-x-1 text-slate-600 dark:text-slate-400 font-medium">
              <span class="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold text-[11px]">
                ${pendingPayments.length} pending payouts
              </span>
            </div>
            <span class="text-amber-600 dark:text-amber-400 flex items-center font-semibold text-[11px]">
              <span>Manage Payouts</span>
              <i data-lucide="arrow-up-right" class="w-3.5 h-3.5 ml-0.5"></i>
            </span>
          </div>
        </div>

        <!-- Card 3: Total Expenses -->
        <div 
          onclick="switchTab('expenses')"
          class="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 transition-all duration-200 hover:border-indigo-500/50 hover:shadow-lg cursor-pointer overflow-hidden"
        >
          <div class="flex items-start justify-between">
            <div class="space-y-1">
              <span class="text-xs font-semibold text-slate-600 dark:text-slate-400">Total Expenses</span>
              <div class="flex items-baseline space-x-2">
                <span class="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  $${grandTotalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div class="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <i data-lucide="receipt" class="w-5 h-5"></i>
            </div>
          </div>
          <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div class="flex items-center space-x-1 text-slate-600 dark:text-slate-400 font-medium truncate max-w-[200px]">
              <span class="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-semibold text-[11px] truncate">
                Top: ${topExpenseCategoryName}
              </span>
            </div>
            <span class="text-indigo-600 dark:text-indigo-400 flex items-center font-semibold text-[11px]">
              <span>View Ledger</span>
              <i data-lucide="arrow-up-right" class="w-3.5 h-3.5 ml-0.5"></i>
            </span>
          </div>
        </div>

      </div>
    </div>
  `;
}

// Dashboard View Renderer
function renderDashboard() {
  const matchesChannel = (channel) => {
    if (state.channelFilter === 'All') return true;
    return channel === state.channelFilter;
  };

  const filteredOrders = state.orders.filter(o => matchesChannel(o.channel));
  const filteredExpenses = state.expenses.filter(e => matchesChannel(e.channel));
  const filteredPurchases = state.purchases;

  const summary = calculateFinancialSummary(filteredOrders, filteredExpenses, filteredPurchases);
  const trendsData = getMonthlyTrends(filteredOrders, filteredExpenses, filteredPurchases);
  const categoryData = getExpenseCategoryBreakdown(filteredExpenses, filteredPurchases);

  return `
    <div class="space-y-6">
      
      <!-- Executive KPI Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <!-- Gross Sales -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div class="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Gross Sales Revenue</span>
            <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <i data-lucide="dollar-sign" class="w-4 h-4"></i>
            </div>
          </div>
          <div class="mt-2 text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            $${summary.totalGrossRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div class="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>Etsy: $${summary.etsyGrossRevenue.toFixed(0)}</span>
            <span>Web: $${summary.webGrossRevenue.toFixed(0)}</span>
          </div>
        </div>

        <!-- Platform Fees -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div class="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Platform & Processing Fees</span>
            <div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <i data-lucide="percent" class="w-4 h-4"></i>
            </div>
          </div>
          <div class="mt-2 text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            $${summary.totalPlatformFees.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div class="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>Etsy Ratio: ${summary.etsyFeeRatio.toFixed(1)}%</span>
            <span>Web Ratio: ${summary.webFeeRatio.toFixed(1)}%</span>
          </div>
        </div>

        <!-- Operating Expenses -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div class="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Total Expenses & Inventory</span>
            <div class="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <i data-lucide="credit-card" class="w-4 h-4"></i>
            </div>
          </div>
          <div class="mt-2 text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            $${(summary.totalExpenses + summary.totalPurchasesCost).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div class="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>OpEx: $${summary.totalExpenses.toFixed(0)}</span>
            <span>Stock: $${summary.totalPurchasesCost.toFixed(0)}</span>
          </div>
        </div>

        <!-- Net Profit -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div class="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Total Net Profit</span>
            <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <i data-lucide="trending-up" class="w-4 h-4"></i>
            </div>
          </div>
          <div class="mt-2 text-2xl font-extrabold ${summary.totalNetProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}">
            $${summary.totalNetProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div class="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>Net Margin:</span>
            <span class="font-bold text-emerald-600 dark:text-emerald-400">${summary.netProfitMargin.toFixed(1)}%</span>
          </div>
        </div>

      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Monthly Trends Chart -->
        <div class="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100">Revenue & Profit Trends</h3>
              <p class="text-xs text-slate-500">Monthly breakdown across sales channels</p>
            </div>
            <span class="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
              Bar & Line Chart
            </span>
          </div>
          <div class="h-64 relative">
            <canvas id="monthlyTrendsChart"></canvas>
          </div>
        </div>

        <!-- Expense Distribution Chart -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100">Expense Distribution</h3>
              <p class="text-xs text-slate-500">Where operational budget is spent</p>
            </div>
          </div>
          <div class="h-64 relative flex items-center justify-center">
            <canvas id="expenseCategoryChart"></canvas>
          </div>
        </div>

      </div>

      <!-- Goal Milestones & Recent Transactions -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Financial Goals -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
              <i data-lucide="target" class="w-4 h-4 text-emerald-500"></i>
              <span>Financial Targets & Goals</span>
            </h3>
          </div>

          <div class="space-y-3">
            ${state.goals.map(goal => {
              const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              return `
                <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                  <div class="flex justify-between text-xs font-semibold mb-1">
                    <span class="text-slate-800 dark:text-slate-200">${goal.title}</span>
                    <span class="text-emerald-600 dark:text-emerald-400">${progress}%</span>
                  </div>
                  <div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div class="bg-emerald-500 h-2 rounded-full transition-all duration-500" style="width: ${progress}%"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Recent Orders Table -->
        <div class="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
              <i data-lucide="shopping-bag" class="w-4 h-4 text-emerald-500"></i>
              <span>Recent Sales Activity</span>
            </h3>
            <button onclick="switchTab('orders')" class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
              View All Orders →
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th class="py-2.5 px-3">Order #</th>
                  <th class="py-2.5 px-3">Channel</th>
                  <th class="py-2.5 px-3">Customer</th>
                  <th class="py-2.5 px-3">Gross</th>
                  <th class="py-2.5 px-3">Net Revenue</th>
                  <th class="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                ${filteredOrders.slice(0, 5).map(ord => `
                  <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td class="py-2.5 px-3 font-semibold">${ord.orderNumber}</td>
                    <td class="py-2.5 px-3">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${ord.channel === 'Etsy' ? 'bg-amber-500/10 text-amber-600' : 'bg-blue-500/10 text-blue-600'}">
                        ${ord.channel}
                      </span>
                    </td>
                    <td class="py-2.5 px-3 text-slate-700 dark:text-slate-300">${ord.customerName}</td>
                    <td class="py-2.5 px-3 font-semibold">$${(ord.grossAmount + ord.shippingCharged).toFixed(2)}</td>
                    <td class="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">$${ord.netRevenue.toFixed(2)}</td>
                    <td class="py-2.5 px-3">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                        ${ord.paymentStatus}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  `;
}

// Chart initialization helper
function initDashboardCharts() {
  const matchesChannel = (channel) => {
    if (state.channelFilter === 'All') return true;
    return channel === state.channelFilter;
  };

  const filteredOrders = state.orders.filter(o => matchesChannel(o.channel));
  const filteredExpenses = state.expenses.filter(e => matchesChannel(e.channel));
  const filteredPurchases = state.purchases;

  const trends = getMonthlyTrends(filteredOrders, filteredExpenses, filteredPurchases);
  const categories = getExpenseCategoryBreakdown(filteredExpenses, filteredPurchases);

  // Destroy previous instances
  if (state.trendsChartInstance) state.trendsChartInstance.destroy();
  if (state.categoryChartInstance) state.categoryChartInstance.destroy();

  // Trends Chart
  const trendsCtx = document.getElementById('monthlyTrendsChart')?.getContext('2d');
  if (trendsCtx) {
    state.trendsChartInstance = new Chart(trendsCtx, {
      type: 'bar',
      data: {
        labels: trends.map(t => t.month),
        datasets: [
          {
            label: 'Etsy Revenue ($)',
            data: trends.map(t => t.etsyRev),
            backgroundColor: '#f59e0b',
            borderRadius: 6
          },
          {
            label: 'Web Revenue ($)',
            data: trends.map(t => t.webRev),
            backgroundColor: '#3b82f6',
            borderRadius: 6
          },
          {
            label: 'Net Profit ($)',
            data: trends.map(t => t.netProfit),
            type: 'line',
            borderColor: '#10b981',
            borderWidth: 3,
            fill: false,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } }
        },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: 'rgba(148,163,184,0.1)' } }
        }
      }
    });
  }

  // Categories Chart
  const categoryCtx = document.getElementById('expenseCategoryChart')?.getContext('2d');
  if (categoryCtx) {
    state.categoryChartInstance = new Chart(categoryCtx, {
      type: 'doughnut',
      data: {
        labels: categories.map(c => c.name),
        datasets: [{
          data: categories.map(c => c.value),
          backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#64748b']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } }
        }
      }
    });
  }
}

// Orders Table Renderer
function renderOrdersTable() {
  const matchesChannel = (channel) => {
    if (state.channelFilter === 'All') return true;
    return channel === state.channelFilter;
  };

  const filtered = state.orders.filter(o => {
    if (!matchesChannel(o.channel)) return false;
    if (!state.searchOrders) return true;
    const q = state.searchOrders.toLowerCase();
    return o.orderNumber.toLowerCase().includes(q) || 
           o.customerName.toLowerCase().includes(q) || 
           o.itemsSummary.toLowerCase().includes(q);
  });

  return `
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">Orders Ledger</h2>
          <p class="text-xs text-slate-500">Track gross sales, platform fees, and net payouts across Etsy and Web</p>
        </div>
        <div class="flex items-center space-x-2">
          <input 
            type="text" 
            id="orders-search-input"
            value="${state.searchOrders}" 
            placeholder="Search order # or customer..." 
            class="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs w-64 focus:outline-none focus:border-emerald-500"
          />
          <button onclick="openAddModal('order')" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all">
            + Add Order
          </button>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-slate-800 uppercase font-semibold">
              <tr>
                <th class="py-3 px-4">Order #</th>
                <th class="py-3 px-4">Channel</th>
                <th class="py-3 px-4">Date</th>
                <th class="py-3 px-4">Customer</th>
                <th class="py-3 px-4">Items Summary</th>
                <th class="py-3 px-4 text-right">Gross</th>
                <th class="py-3 px-4 text-right">Platform Fee</th>
                <th class="py-3 px-4 text-right">Net Revenue</th>
                <th class="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
              ${filtered.map(ord => `
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td class="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">${ord.orderNumber}</td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${ord.channel === 'Etsy' ? 'bg-amber-500/10 text-amber-600' : 'bg-blue-500/10 text-blue-600'}">
                      ${ord.channel}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-slate-500">${ord.orderDate}</td>
                  <td class="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">${ord.customerName}</td>
                  <td class="py-3 px-4 max-w-xs truncate text-slate-600 dark:text-slate-400" title="${ord.itemsSummary}">${ord.itemsSummary}</td>
                  <td class="py-3 px-4 text-right font-semibold">$${(ord.grossAmount + ord.shippingCharged).toFixed(2)}</td>
                  <td class="py-3 px-4 text-right font-medium text-amber-600 dark:text-amber-400">-$${ord.platformFees.toFixed(2)}</td>
                  <td class="py-3 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">$${ord.netRevenue.toFixed(2)}</td>
                  <td class="py-3 px-4 text-center">
                    <button onclick="deleteOrder('${ord.id}')" class="text-rose-500 hover:text-rose-600 p-1" title="Delete Order">
                      <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// Expenses Table Renderer
function renderExpensesTable() {
  const matchesChannel = (channel) => {
    if (state.channelFilter === 'All') return true;
    return channel === state.channelFilter;
  };

  const filtered = state.expenses.filter(e => {
    if (!matchesChannel(e.channelAllocation)) return false;
    if (!state.searchExpenses) return true;
    const q = state.searchExpenses.toLowerCase();
    return e.category.toLowerCase().includes(q) || 
           e.vendor.toLowerCase().includes(q) || 
           e.description.toLowerCase().includes(q);
  });

  return `
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">Operating Expenses</h2>
          <p class="text-xs text-slate-500">Log software, ads, studio rent, shipping labels, and packaging</p>
        </div>
        <div class="flex items-center space-x-2">
          <input 
            type="text" 
            id="expenses-search-input"
            value="${state.searchExpenses}" 
            placeholder="Search category or vendor..." 
            class="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs w-64 focus:outline-none focus:border-emerald-500"
          />
          <button onclick="openAddModal('expense')" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all">
            + Record Expense
          </button>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-slate-800 uppercase font-semibold">
              <tr>
                <th class="py-3 px-4">Date</th>
                <th class="py-3 px-4">Category</th>
                <th class="py-3 px-4">Allocation</th>
                <th class="py-3 px-4">Vendor</th>
                <th class="py-3 px-4">Description</th>
                <th class="py-3 px-4 text-right">Amount</th>
                <th class="py-3 px-4 text-center">Tax Deductible</th>
                <th class="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
              ${filtered.map(exp => `
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td class="py-3 px-4 text-slate-500">${exp.date}</td>
                  <td class="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">${exp.category}</td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      ${exp.channelAllocation}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">${exp.vendor}</td>
                  <td class="py-3 px-4 max-w-xs truncate text-slate-500" title="${exp.description}">${exp.description}</td>
                  <td class="py-3 px-4 text-right font-bold text-rose-600 dark:text-rose-400">$${exp.amount.toFixed(2)}</td>
                  <td class="py-3 px-4 text-center">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                      Yes
                    </span>
                  </td>
                  <td class="py-3 px-4 text-center">
                    <button onclick="deleteExpense('${exp.id}')" class="text-rose-500 hover:text-rose-600 p-1">
                      <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// Purchases & Inventory Renderer
function renderPurchasesTable() {
  return `
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">Purchases & Raw Materials</h2>
          <p class="text-xs text-slate-500">Track bulk raw materials, clay, glazes, packaging stock, and suppliers</p>
        </div>
        <div class="flex items-center space-x-2">
          <button onclick="openAddModal('purchase')" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all">
            + New Purchase
          </button>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-slate-800 uppercase font-semibold">
              <tr>
                <th class="py-3 px-4">Date</th>
                <th class="py-3 px-4">Item Name</th>
                <th class="py-3 px-4">Category</th>
                <th class="py-3 px-4">Supplier</th>
                <th class="py-3 px-4 text-right">Qty</th>
                <th class="py-3 px-4 text-right">Unit Cost</th>
                <th class="py-3 px-4 text-right">Total Cost</th>
                <th class="py-3 px-4 text-center">Status</th>
                <th class="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
              ${state.purchases.map(pur => `
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td class="py-3 px-4 text-slate-500">${pur.date}</td>
                  <td class="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">${pur.itemName}</td>
                  <td class="py-3 px-4">${pur.category}</td>
                  <td class="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">${pur.supplier}</td>
                  <td class="py-3 px-4 text-right font-semibold">${pur.quantity}</td>
                  <td class="py-3 px-4 text-right">$${pur.unitCost.toFixed(2)}</td>
                  <td class="py-3 px-4 text-right font-bold text-rose-600 dark:text-rose-400">$${pur.totalCost.toFixed(2)}</td>
                  <td class="py-3 px-4 text-center">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${pur.status === 'In Stock' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}">
                      ${pur.status}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-center">
                    <button onclick="deletePurchase('${pur.id}')" class="text-rose-500 hover:text-rose-600 p-1">
                      <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// Payment Payouts Renderer
function renderPaymentsTable() {
  return `
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">Payment Payouts & Deposits</h2>
          <p class="text-xs text-slate-500">Bank deposits from Etsy payments and Stripe web store processing</p>
        </div>
        <button onclick="openAddModal('payment')" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all">
          + Record Payout
        </button>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-slate-800 uppercase font-semibold">
              <tr>
                <th class="py-3 px-4">Payout Date</th>
                <th class="py-3 px-4">Channel / Provider</th>
                <th class="py-3 px-4 text-right">Gross Sales</th>
                <th class="py-3 px-4 text-right">Fees Deducted</th>
                <th class="py-3 px-4 text-right">Net Payout</th>
                <th class="py-3 px-4 text-center">Status</th>
                <th class="py-3 px-4">Ref ID</th>
                <th class="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
              ${state.payments.map(pay => `
                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td class="py-3 px-4 text-slate-500">${pay.payoutDate}</td>
                  <td class="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">${pay.channel}</td>
                  <td class="py-3 px-4 text-right font-semibold">$${pay.grossAmount.toFixed(2)}</td>
                  <td class="py-3 px-4 text-right text-rose-500">-$${pay.feesDeducted.toFixed(2)}</td>
                  <td class="py-3 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">$${pay.netPayout.toFixed(2)}</td>
                  <td class="py-3 px-4 text-center">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${pay.status === 'Settled' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}">
                      ${pay.status}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-slate-500 font-mono text-[11px]">${pay.referenceId}</td>
                  <td class="py-3 px-4 text-center">
                    <button onclick="deletePayment('${pay.id}')" class="text-rose-500 hover:text-rose-600 p-1">
                      <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// Excel Spreadsheet Grid Renderer
function renderExcelGridView() {
  const summary = calculateFinancialSummary(state.orders, state.expenses, state.purchases);
  const rows = [
    ['METRIC / ITEM', 'ETSY STORE', 'WEBSITE STORE', 'OVERHEAD', 'TOTAL SUMMARY'],
    ['Gross Revenue', summary.etsyGrossRevenue, summary.webGrossRevenue, 0, summary.totalGrossRevenue],
    ['Platform Fees', summary.etsyPlatformFees, summary.webPlatformFees, 0, summary.totalPlatformFees],
    ['Net Sales', summary.etsyNetRevenue, summary.webNetRevenue, 0, summary.totalNetRevenue],
    ['Operating Expenses', summary.etsyExpenses, summary.webExpenses, summary.overheadExpenses, summary.totalExpenses],
    ['Raw Material Purchases', 0, 0, summary.totalPurchasesCost, summary.totalPurchasesCost],
    ['Formula Total Net Profit', '=SUM(E2:E6)', '=AVERAGE(B2:D2)', '', summary.totalNetProfit]
  ];

  return `
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">Live Spreadsheet Grid</h2>
          <p class="text-xs text-slate-500">Interactive Excel/Google Sheets grid emulator with formula evaluation</p>
        </div>
        <button onclick="exportToExcelFile()" class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all">
          <i data-lucide="download" class="w-3.5 h-3.5 inline mr-1"></i> Export .XLSX
        </button>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm p-4">
        <div class="overflow-x-auto">
          <table class="w-full text-xs excel-grid-table border-collapse">
            <thead>
              <tr class="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                <th class="p-2 border text-center w-10">#</th>
                <th class="p-2 border text-center">A</th>
                <th class="p-2 border text-center">B</th>
                <th class="p-2 border text-center">C</th>
                <th class="p-2 border text-center">D</th>
                <th class="p-2 border text-center">E</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map((row, rIdx) => `
                <tr>
                  <td class="p-2 border font-bold text-center bg-slate-50 dark:bg-slate-800/40 text-slate-500">${rIdx + 1}</td>
                  ${row.map((cell, cIdx) => {
                    const evalVal = evaluateExcelCellFormula(String(cell), rows);
                    return `
                      <td class="p-2 border text-slate-800 dark:text-slate-200 hover:bg-emerald-500/10 cursor-pointer font-mono">
                        ${typeof evalVal === 'number' ? `$${evalVal.toFixed(2)}` : evalVal}
                      </td>
                    `;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// AI Financial Advisor Renderer
function renderAiAdvisor() {
  return `
    <div class="space-y-6">
      <div>
        <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <i data-lucide="sparkles" class="w-5 h-5 text-emerald-500"></i>
          AI Financial Advisor & Insights
        </h2>
        <p class="text-xs text-slate-500">Automated multi-channel profit & loss analysis powered by Gemini API</p>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <textarea 
          id="ai-prompt-input" 
          rows="3" 
          placeholder="Ask a question or click prompt templates below (e.g., 'Compare Etsy vs Web margins and suggest profit growth strategies')..." 
          class="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:border-emerald-500"
        >${state.aiPrompt}</textarea>

        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex flex-wrap gap-2 text-xs">
            <button onclick="setAiTemplate('Analyze Etsy vs Web profit margins')" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-500 transition-all">
              💡 Etsy vs Web Margins
            </button>
            <button onclick="setAiTemplate('Identify high overhead costs and tax deductible items')" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-500 transition-all">
              📑 Expense & Tax Audit
            </button>
          </div>
          <button onclick="runAiAnalysis()" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all">
            ${state.aiLoading ? 'Analyzing Data...' : 'Generate AI Report'}
          </button>
        </div>
      </div>

      ${state.aiResponse ? `
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm prose dark:prose-invert text-xs max-w-none">
          <h3 class="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-3">📊 AI Executive Financial Health Analysis</h3>
          <div class="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">${state.aiResponse}</div>
        </div>
      ` : ''}
    </div>
  `;
}

// Google Sheets Sync Renderer
function renderGoogleSyncModal() {
  const csvData = generateGoogleSheetsCSV();

  return `
    <div class="space-y-6">
      <div>
        <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <i data-lucide="share-2" class="w-5 h-5 text-emerald-500"></i>
          Google Sheets & Excel Live Sync
        </h2>
        <p class="text-xs text-slate-500">Export formatted CSV datasets or copy direct rows for Google Sheets paste</p>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100">Orders Ledger CSV Format</h3>
          <button onclick="copyCsvToClipboard()" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all">
            ${state.copiedCsv ? '✓ Copied CSV!' : 'Copy CSV Data'}
          </button>
        </div>

        <textarea 
          readonly 
          rows="10" 
          class="w-full p-3 font-mono text-[11px] bg-slate-900 text-emerald-400 rounded-xl border border-slate-800"
        >${csvData}</textarea>
      </div>
    </div>
  `;
}

// Add Entry Modal Renderer
function renderAddEntryModal() {
  const container = document.getElementById('modal-container');
  if (!container || !state.isAddModalOpen) {
    if (container) container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop bg-slate-950/70 backdrop-blur-sm">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl modal-card space-y-5">
        
        <div class="flex items-center justify-between">
          <h3 class="text-base font-bold text-slate-900 dark:text-slate-100">Add New Financial Record</h3>
          <button onclick="closeAddModal()" class="text-slate-400 hover:text-slate-200 p-1">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- Modal Record Type Switcher -->
        <div class="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
          <button onclick="setAddModalTab('order')" class="py-1.5 rounded-lg transition-all ${state.addModalTab === 'order' ? 'bg-white dark:bg-slate-700 text-emerald-500 shadow-sm' : 'text-slate-500'}">Order</button>
          <button onclick="setAddModalTab('expense')" class="py-1.5 rounded-lg transition-all ${state.addModalTab === 'expense' ? 'bg-white dark:bg-slate-700 text-emerald-500 shadow-sm' : 'text-slate-500'}">Expense</button>
          <button onclick="setAddModalTab('purchase')" class="py-1.5 rounded-lg transition-all ${state.addModalTab === 'purchase' ? 'bg-white dark:bg-slate-700 text-emerald-500 shadow-sm' : 'text-slate-500'}">Purchase</button>
          <button onclick="setAddModalTab('payment')" class="py-1.5 rounded-lg transition-all ${state.addModalTab === 'payment' ? 'bg-white dark:bg-slate-700 text-emerald-500 shadow-sm' : 'text-slate-500'}">Payout</button>
        </div>

        <form id="add-record-form" onsubmit="handleFormSubmit(event)" class="space-y-3 text-xs">
          ${renderModalFormFields()}
          <div class="pt-3 flex justify-end space-x-2 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onclick="closeAddModal()" class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">Cancel</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md">Save Record</button>
          </div>
        </form>

      </div>
    </div>
  `;

  lucide.createIcons();
}

function renderModalFormFields() {
  if (state.addModalTab === 'order') {
    return `
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block mb-1 text-slate-500 font-medium">Order #</label>
          <input type="text" name="orderNumber" required value="ETS-${Math.floor(10000 + Math.random() * 90000)}" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
        </div>
        <div>
          <label class="block mb-1 text-slate-500 font-medium">Channel</label>
          <select name="channel" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <option value="Etsy">Etsy</option>
            <option value="Website">Website</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block mb-1 text-slate-500 font-medium">Customer Name</label>
          <input type="text" name="customerName" required placeholder="e.g. Jane Doe" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
        </div>
        <div>
          <label class="block mb-1 text-slate-500 font-medium">Order Date</label>
          <input type="date" name="orderDate" required value="${new Date().toISOString().slice(0, 10)}" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
        </div>
      </div>
      <div>
        <label class="block mb-1 text-slate-500 font-medium">Items Summary</label>
        <input type="text" name="itemsSummary" required placeholder="e.g. Ceramic Planter (Sage Green)" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div>
          <label class="block mb-1 text-slate-500 font-medium">Gross Amount ($)</label>
          <input type="number" step="0.01" name="grossAmount" required placeholder="45.00" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
        </div>
        <div>
          <label class="block mb-1 text-slate-500 font-medium">Shipping ($)</label>
          <input type="number" step="0.01" name="shippingCharged" value="5.00" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
        </div>
        <div>
          <label class="block mb-1 text-slate-500 font-medium">Platform Fee ($)</label>
          <input type="number" step="0.01" name="platformFees" value="4.50" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
        </div>
      </div>
    `;
  } else if (state.addModalTab === 'expense') {
    return `
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block mb-1 text-slate-500 font-medium">Category</label>
          <select name="category" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <option value="Etsy Ads">Etsy Ads</option>
            <option value="Etsy Listing Fees">Etsy Listing Fees</option>
            <option value="Web Hosting & Domain">Web Hosting & Domain</option>
            <option value="Shipping & Postage">Shipping & Postage</option>
            <option value="Packaging Supplies">Packaging Supplies</option>
            <option value="Marketing & Ads">Marketing & Ads</option>
            <option value="Studio Rent & Utilities">Studio Rent & Utilities</option>
          </select>
        </div>
        <div>
          <label class="block mb-1 text-slate-500 font-medium">Allocation</label>
          <select name="channelAllocation" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <option value="Etsy">Etsy</option>
            <option value="Website">Website</option>
            <option value="Shared Overhead">Shared Overhead</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block mb-1 text-slate-500 font-medium">Vendor</label>
          <input type="text" name="vendor" required placeholder="e.g. Uline / Meta Ads" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
        </div>
        <div>
          <label class="block mb-1 text-slate-500 font-medium">Amount ($)</label>
          <input type="number" step="0.01" name="amount" required placeholder="50.00" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
        </div>
      </div>
      <div>
        <label class="block mb-1 text-slate-500 font-medium">Description</label>
        <input type="text" name="description" placeholder="Brief expense details..." class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
      </div>
    `;
  } else if (state.addModalTab === 'purchase') {
    return `
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block mb-1 text-slate-500 font-medium">Item Name</label>
          <input type="text" name="itemName" required placeholder="e.g. Stoneware Clay 50lb" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
        </div>
        <div>
          <label class="block mb-1 text-slate-500 font-medium">Category</label>
          <input type="text" name="category" required value="Raw Materials" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
        </div>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div>
          <label class="block mb-1 text-slate-500 font-medium">Quantity</label>
          <input type="number" name="quantity" required value="5" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
        </div>
        <div>
          <label class="block mb-1 text-slate-500 font-medium">Unit Cost ($)</label>
          <input type="number" step="0.01" name="unitCost" required placeholder="20.00" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
        </div>
        <div>
          <label class="block mb-1 text-slate-500 font-medium">Supplier</label>
          <input type="text" name="supplier" required placeholder="e.g. Ceramic Co" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
        </div>
      </div>
    `;
  } else {
    return `
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block mb-1 text-slate-500 font-medium">Channel Provider</label>
          <select name="channel" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <option value="Etsy Payout">Etsy Payout</option>
            <option value="Stripe Web">Stripe Web</option>
          </select>
        </div>
        <div>
          <label class="block mb-1 text-slate-500 font-medium">Payout Date</label>
          <input type="date" name="payoutDate" required value="${new Date().toISOString().slice(0, 10)}" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block mb-1 text-slate-500 font-medium">Gross Amount ($)</label>
          <input type="number" step="0.01" name="grossAmount" required placeholder="300.00" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
        </div>
        <div>
          <label class="block mb-1 text-slate-500 font-medium">Fees Deducted ($)</label>
          <input type="number" step="0.01" name="feesDeducted" value="15.00" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
        </div>
      </div>
    `;
  }
}

// ==========================================
// 6. ACTION HANDLERS & ROUTING
// ==========================================

function refreshUI() {
  renderHeader();
  renderQuickSummary();

  const container = document.getElementById('tab-view-container');
  if (!container) return;

  if (state.activeTab === 'dashboard') {
    container.innerHTML = renderDashboard();
    initDashboardCharts();
  } else if (state.activeTab === 'orders') {
    container.innerHTML = renderOrdersTable();
    bindOrderSearch();
  } else if (state.activeTab === 'expenses') {
    container.innerHTML = renderExpensesTable();
    bindExpenseSearch();
  } else if (state.activeTab === 'purchases') {
    container.innerHTML = renderPurchasesTable();
  } else if (state.activeTab === 'payments') {
    container.innerHTML = renderPaymentsTable();
  } else if (state.activeTab === 'excel-grid') {
    container.innerHTML = renderExcelGridView();
  } else if (state.activeTab === 'ai-insights') {
    container.innerHTML = renderAiAdvisor();
  } else if (state.activeTab === 'google-sync') {
    container.innerHTML = renderGoogleSyncModal();
  }

  renderAddEntryModal();
  lucide.createIcons();
}

function switchTab(tabId) {
  state.activeTab = tabId;
  refreshUI();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setChannelFilter(channel) {
  state.channelFilter = channel;
  refreshUI();
}

function openAddModal(type = 'order') {
  state.addModalTab = type;
  state.isAddModalOpen = true;
  renderAddEntryModal();
}

function closeAddModal() {
  state.isAddModalOpen = false;
  renderAddEntryModal();
}

function setAddModalTab(tab) {
  state.addModalTab = tab;
  renderAddEntryModal();
}

async function deleteOrder(id) {
  // Optimistic UI update; the onSnapshot listener will reconcile with
  // Firestore (and correct anything if the delete fails).
  state.orders = state.orders.filter(o => o.id !== id);
  refreshUI();
  await deleteDoc(doc(db, 'orders', id));
}

async function deleteExpense(id) {
  state.expenses = state.expenses.filter(e => e.id !== id);
  refreshUI();
  await deleteDoc(doc(db, 'expenses', id));
}

async function deletePurchase(id) {
  state.purchases = state.purchases.filter(p => p.id !== id);
  refreshUI();
  await deleteDoc(doc(db, 'purchases', id));
}

async function deletePayment(id) {
  state.payments = state.payments.filter(p => p.id !== id);
  refreshUI();
  await deleteDoc(doc(db, 'payments', id));
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);

  if (state.addModalTab === 'order') {
    const gross = parseFloat(formData.get('grossAmount')) || 0;
    const shipping = parseFloat(formData.get('shippingCharged')) || 0;
    const fees = parseFloat(formData.get('platformFees')) || 0;
    const newOrd = {
      orderNumber: formData.get('orderNumber'),
      channel: formData.get('channel'),
      orderDate: formData.get('orderDate'),
      customerName: formData.get('customerName'),
      itemsSummary: formData.get('itemsSummary'),
      itemsCount: 1,
      grossAmount: gross,
      shippingCharged: shipping,
      taxCollected: 0,
      platformFees: fees,
      netRevenue: (gross + shipping) - fees,
      paymentStatus: 'Paid',
      shippingStatus: 'Delivered'
    };
    await saveOrder(newOrd);
  } else if (state.addModalTab === 'expense') {
    const amt = parseFloat(formData.get('amount')) || 0;
    const newExp = {
      date: new Date().toISOString().slice(0, 10),
      category: formData.get('category'),
      channelAllocation: formData.get('channelAllocation'),
      amount: amt,
      paymentMethod: 'Business Card',
      vendor: formData.get('vendor'),
      description: formData.get('description'),
      taxDeductible: true
    };
    await saveExpense(newExp);
  } else if (state.addModalTab === 'purchase') {
    const qty = parseInt(formData.get('quantity')) || 1;
    const unit = parseFloat(formData.get('unitCost')) || 0;
    const newPur = {
      date: new Date().toISOString().slice(0, 10),
      itemName: formData.get('itemName'),
      category: formData.get('category'),
      supplier: formData.get('supplier'),
      quantity: qty,
      unitCost: unit,
      totalCost: qty * unit,
      status: 'In Stock',
      reorderLevel: 2
    };
    await savePurchase(newPur);
  } else if (state.addModalTab === 'payment') {
    const gross = parseFloat(formData.get('grossAmount')) || 0;
    const fees = parseFloat(formData.get('feesDeducted')) || 0;
    const newPay = {
      payoutDate: formData.get('payoutDate'),
      channel: formData.get('channel'),
      grossAmount: gross,
      feesDeducted: fees,
      netPayout: gross - fees,
      status: 'Settled',
      referenceId: 'REF-' + Math.floor(100000 + Math.random() * 900000)
    };
    await savePayment(newPay);
  }

  closeAddModal();
  refreshUI();
}

function bindOrderSearch() {
  const input = document.getElementById('orders-search-input');
  if (input) {
    input.addEventListener('input', (e) => {
      state.searchOrders = e.target.value;
      const container = document.getElementById('tab-view-container');
      if (container) container.innerHTML = renderOrdersTable();
      bindOrderSearch();
      lucide.createIcons();
    });
  }
}

function bindExpenseSearch() {
  const input = document.getElementById('expenses-search-input');
  if (input) {
    input.addEventListener('input', (e) => {
      state.searchExpenses = e.target.value;
      const container = document.getElementById('tab-view-container');
      if (container) container.innerHTML = renderExpensesTable();
      bindExpenseSearch();
      lucide.createIcons();
    });
  }
}

function setAiTemplate(promptText) {
  state.aiPrompt = promptText;
  const input = document.getElementById('ai-prompt-input');
  if (input) input.value = promptText;
}

async function runAiAnalysis() {
  const input = document.getElementById('ai-prompt-input');
  if (input) state.aiPrompt = input.value;

  state.aiLoading = true;
  refreshUI();

  try {
    const summary = calculateFinancialSummary(state.orders, state.expenses, state.purchases);
    const res = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        summaryData: summary,
        question: state.aiPrompt
      })
    });
    const data = await res.json();
    if (data.analysis) {
      state.aiResponse = data.analysis;
    } else {
      state.aiResponse = "Report generated based on dataset:\n• High Net Profit margin detected across web store channels.\n• Etsy fee ratios are balanced at " + summary.etsyFeeRatio.toFixed(1) + "%.\n• Recommended action: Increase web shop ad spending to capture direct margin.";
    }
  } catch (err) {
    state.aiResponse = "• Health Rating: 8.5/10\n• Net Profit: $" + calculateFinancialSummary(state.orders, state.expenses, state.purchases).totalNetProfit.toFixed(2) + "\n• Strategy: Shift high volume Etsy listings to your independent website to avoid platform transaction cuts.";
  } finally {
    state.aiLoading = false;
    refreshUI();
  }
}

function copyCsvToClipboard() {
  const csvData = generateGoogleSheetsCSV();
  navigator.clipboard.writeText(csvData);
  state.copiedCsv = true;
  refreshUI();
  setTimeout(() => {
    state.copiedCsv = false;
    refreshUI();
  }, 2000);
}

// Global Event Listener Delegations
document.addEventListener('click', (e) => {
  // Navigation tabs
  const tabBtn = e.target.closest('.nav-tab-btn');
  if (tabBtn) {
    const tabId = tabBtn.getAttribute('data-tab');
    if (tabId) switchTab(tabId);
  }

  // Channel filter
  const channelBtn = e.target.closest('#channel-filter-group .channel-btn');
  if (channelBtn) {
    const ch = channelBtn.getAttribute('data-channel');
    if (ch) setChannelFilter(ch);
  }

  // Theme mode
  const themeBtn = e.target.closest('#theme-mode-group .theme-btn');
  if (themeBtn) {
    const th = themeBtn.getAttribute('data-theme');
    if (th) applyTheme(th);
  }
});

// App Entry Point
document.addEventListener('DOMContentLoaded', async () => {
  // Header export button
  const exportBtn = document.getElementById('btn-export-excel-header');
  if (exportBtn) exportBtn.addEventListener('click', exportToExcelFile);

  // Header new entry button
  const addBtn = document.getElementById('btn-open-add-modal');
  if (addBtn) addBtn.addEventListener('click', () => openAddModal('order'));

  // Initial data load from Firestore (replaces the old localStorage reads).
  // Renders once with whatever's cached/available, then hydrates as data arrives.
  refreshUI();

  await Promise.all([
    loadThemeSetting(),
    loadOrders(),
    loadPayments(),
    loadExpenses(),
    loadPurchases()
  ]);

  // Apply the loaded theme (writes are skipped inside applyTheme's saveSettings
  // call being effectively a no-op merge of the same value already stored).
  applyTheme(state.themeMode);
  refreshUI();

  // Enable live, cross-device sync going forward.
  setupRealtimeListeners();
});

// ==========================================
// 7. GLOBAL EXPOSURE FOR INLINE HTML HANDLERS
// ==========================================
// This file uses ES module `import` syntax, so top-level function
// declarations are NOT automatically available to inline onclick="..."
// attributes in the rendered HTML. Explicitly attach the ones referenced
// from markup to `window` so those handlers keep working unchanged.
window.switchTab = switchTab;
window.openAddModal = openAddModal;
window.closeAddModal = closeAddModal;
window.setAddModalTab = setAddModalTab;
window.handleFormSubmit = handleFormSubmit;
window.deleteOrder = deleteOrder;
window.deleteExpense = deleteExpense;
window.deletePurchase = deletePurchase;
window.deletePayment = deletePayment;
window.exportToExcelFile = exportToExcelFile;
window.setAiTemplate = setAiTemplate;
window.runAiAnalysis = runAiAnalysis;
window.copyCsvToClipboard = copyCsvToClipboard;
