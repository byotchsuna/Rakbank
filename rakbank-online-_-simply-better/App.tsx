import React, { useState, useEffect } from 'react';
import { 
  Menu, Bell, ChevronRight, Landmark, ArrowRightLeft, CreditCard, 
  HelpCircle, LogOut, Loader2, Send, CheckCircle2, AlertCircle, TrendingUp,
  X, Shield, Smartphone, Settings, UserCircle, Plus, Wallet, Globe, MapPin, Search,
  ArrowUpRight, ArrowDownLeft
} from 'lucide-react';
import { RAKBANK_MOCK_USER } from './constants';
import { UserProfile, Transaction } from './types';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'accounts' | 'transfer' | 'assistant' | 'cards'>('accounts');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserProfile>(RAKBANK_MOCK_USER);
  const [assistantMessages, setAssistantMessages] = useState<{role: 'user'|'assistant', text: string}[]>([]);
  const [assistantInput, setAssistantInput] = useState('');
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Transfer State
  const [transferAmount, setTransferAmount] = useState('');
  const [iban, setIban] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    // Simple demo auth
    if (loginEmail === 'adam.smith@example.com' && loginPassword === '123456') {
      setIsLoading(true);
      setTimeout(() => {
        setIsAuthenticated(true);
        setIsLoading(false);
        setAssistantMessages([{ role: 'assistant', text: `Welcome back, ${user.name.split(' ')[0]}. I'm your RAKBANK Digital Assistant. How can I help you today?` }]);
      }, 1000);
    } else {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  const handleAssistantSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assistantInput.trim() || isAssistantLoading) return;

    const query = assistantInput.trim();
    setAssistantInput('');
    setAssistantMessages(prev => [...prev, { role: 'user', text: query }]);
    setIsAssistantLoading(true);

    const response = await geminiService.getRakAssistantResponse(query, user);
    setAssistantMessages(prev => [...prev, { role: 'assistant', text: response }]);
    setIsAssistantLoading(false);
  };

  const executeTransfer = () => {
    if (!transferAmount || !iban) return;
    setIsTransferring(true);

    setTimeout(() => {
      const amount = parseFloat(transferAmount);
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        merchant: `Transfer to ${recipientName || 'External Account'}`,
        amount: amount,
        type: 'out',
        category: 'Transfer'
      };

      setUser(prev => ({
        ...prev,
        balance: prev.balance - amount,
        transactions: [newTx, ...prev.transactions]
      }));

      setIsTransferring(false);
      setTransferSuccess(true);
    }, 1500);
  };

  const resetTransferForm = () => {
    setTransferSuccess(false);
    setTransferAmount('');
    setIban('');
    setRecipientName('');
    setActiveTab('accounts');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-6">
        <div className="rak-logo-icon w-16 h-16 text-3xl mb-4 animate-bounce">R</div>
        <p className="text-sm font-bold text-gray-400 tracking-widest uppercase animate-pulse">RAKBANK | Simply Better</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center">
        <header className="w-full h-16 flex items-center justify-between px-8 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
          <div className="rak-logo-container">
             <div className="rak-logo-icon">R</div>
             <h1 className="text-[#E11932] text-xl font-extrabold tracking-tight">RAKBANK</h1>
          </div>
        </header>

        <div className="max-w-[400px] w-full px-6 mt-16 md:mt-24">
          <div className="bg-white p-10 rak-card border border-gray-100 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Login</h2>
            <p className="text-gray-500 text-sm mb-8">Access your digital banking portal</p>
            
            {loginError && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-[#E11932] text-[#E11932] text-sm font-medium rounded animate-in fade-in">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">User ID / Email</label>
                <input 
                  type="text" 
                  className="w-full rak-input"
                  placeholder="Enter your user ID"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Password</label>
                <input 
                  type="password" 
                  className="w-full rak-input"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full btn-rak py-4 text-sm uppercase tracking-widest mt-4"
              >
                Sign In
              </button>
              <div className="flex justify-between items-center pt-4">
                <p className="text-[#E11932] text-sm font-bold cursor-pointer hover:underline">Forgot ID?</p>
                <p className="text-[#E11932] text-sm font-bold cursor-pointer hover:underline">Forgot Password?</p>
              </div>
            </form>
          </div>
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">Don't have an account? <span className="text-[#E11932] font-bold cursor-pointer hover:underline">Open a Red Account</span></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[100] transition-opacity backdrop-blur-sm"
          onClick={toggleSidebar}
        >
          <div 
            className="w-72 h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-8 border-b border-gray-100 bg-gray-50">
               <div className="flex justify-between items-center mb-8">
                  <div className="rak-logo-container">
                    <div className="rak-logo-icon">R</div>
                    <span className="text-gray-900 font-bold text-lg">RAKBANK</span>
                  </div>
                  <button onClick={toggleSidebar} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#E11932] rounded-full flex items-center justify-center text-white shadow-lg shadow-red-200">
                    <UserCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#E11932] uppercase tracking-tighter">Elite Client</p>
                    <p className="font-bold text-gray-800 leading-tight">{user.name}</p>
                  </div>
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto py-6">
              <div className="px-4 space-y-1">
                {[
                  { id: 'accounts', label: 'My Dashboard', icon: Landmark },
                  { id: 'transfer', label: 'Transfer & Pay', icon: ArrowRightLeft },
                  { id: 'cards', label: 'My Cards', icon: CreditCard },
                  { id: 'assistant', label: 'Smart Assistant', icon: HelpCircle },
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => { setActiveTab(item.id as any); toggleSidebar(); }}
                    className={`w-full px-6 py-4 flex items-center gap-4 rounded-xl transition-all ${activeTab === item.id ? 'text-white rak-red shadow-lg shadow-red-100' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-gray-400'}`} />
                    <span className="font-bold text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 border-t border-gray-100">
              <button 
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-[#E11932] font-bold text-sm transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <nav className="h-16 bg-white flex items-center justify-between px-6 border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <button onClick={toggleSidebar} className="text-gray-500 hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <div className="rak-logo-container">
             <div className="rak-logo-icon scale-90">R</div>
             <span className="text-gray-900 font-extrabold tracking-tight text-xl hidden sm:inline">RAKBANK</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:bg-gray-50 p-2 relative rounded-lg">
            <Bell className="w-6 h-6" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#E11932] rounded-full border-2 border-white"></span>
          </button>
          <button className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
               <UserCircle className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold">{user.name.split(' ')[0]}</span>
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-6 md:p-10 mb-20">
        
        {activeTab === 'accounts' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900">Marhaba, {user.name.split(' ')[0]}!</h2>
                <p className="text-gray-500 font-medium">Your portfolio looks great today.</p>
              </div>
              <div className="bg-white p-6 rak-card border-t-4 border-[#E11932] min-w-[280px]">
                <p className="text-xs text-gray-400 font-bold uppercase mb-2 tracking-widest">Total Net Worth</p>
                <p className="text-3xl font-black text-gray-900">
                  <span className="text-sm font-bold text-gray-400 mr-1">AED</span>
                  {user.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="grid gap-6">
               <div className="bg-white p-6 rak-card border-l-8 border-[#E11932] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-2xl transition-all cursor-pointer group">
                  <div className="flex gap-5 items-center">
                    <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-[#E11932] group-hover:scale-110 transition-transform">
                      <Landmark className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="font-extrabold text-gray-900 text-lg">Elite Current Account (...5502)</p>
                      <p className="text-sm text-gray-500 font-bold uppercase">Primary Account</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Available Balance</p>
                    <p className="text-2xl font-black text-gray-900">
                      <span className="text-xs font-bold mr-1">AED</span>
                      {user.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
               </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               <div className="md:col-span-2 bg-white p-8 rak-card">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-extrabold text-gray-900 text-xl">Recent Activity</h3>
                    <button className="text-[#E11932] text-sm font-bold hover:underline flex items-center gap-1">
                      View Statements <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-6">
                    {user.transactions.map(tx => (
                      <div key={tx.id} className="flex justify-between items-center group cursor-pointer">
                        <div className="flex gap-4 items-center">
                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${tx.type === 'in' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-500'}`}>
                             {tx.type === 'in' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                           </div>
                           <div>
                             <p className="font-bold text-gray-900">{tx.merchant}</p>
                             <p className="text-xs text-gray-400 font-bold uppercase">{tx.date} • {tx.category}</p>
                           </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-black text-lg ${tx.type === 'in' ? 'text-emerald-600' : 'text-gray-900'}`}>
                            {tx.type === 'in' ? '+' : '-'}{tx.amount.toLocaleString()}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">AED</p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="bg-white p-6 rak-card flex flex-col gap-6 items-center text-center">
                     <div className="w-24 h-24 rounded-full border-8 border-emerald-50 flex flex-col items-center justify-center bg-white shadow-inner">
                        <p className="text-2xl font-black text-emerald-600 leading-none">{user.creditScore}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Score</p>
                     </div>
                     <div>
                        <p className="font-extrabold text-gray-900">RAK Credit Journey</p>
                        <p className="text-sm text-gray-500 mb-4">Your credit health is excellent.</p>
                        <button className="w-full py-3 bg-gray-50 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-100 transition-colors">Check Details</button>
                     </div>
                  </div>
                  
                  <div className="bg-[#1a1a1a] p-6 rak-card text-white relative overflow-hidden group cursor-pointer shadow-2xl">
                     <div className="relative z-10">
                        <p className="text-xs font-bold text-[#E11932] uppercase mb-2 tracking-widest">RAKrewards Points</p>
                        <p className="text-4xl font-black">128,450</p>
                        <div className="mt-8 flex gap-3">
                           <button className="flex-1 bg-[#E11932] py-3 rounded-lg font-bold text-xs uppercase tracking-tighter hover:bg-[#c41228] transition-colors">Redeem</button>
                           <button className="flex-1 border border-white/20 py-3 rounded-lg font-bold text-xs uppercase tracking-tighter hover:bg-white/10 transition-colors">History</button>
                        </div>
                     </div>
                     <TrendingUp className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 group-hover:scale-110 transition-transform duration-500" />
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'transfer' && (
          <div className="animate-in slide-in-from-bottom duration-500 max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Transfer & Pay</h2>
            
            {transferSuccess ? (
              <div className="bg-white p-12 rak-card text-center shadow-2xl">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Transaction Successful</h3>
                <p className="text-gray-500 mb-8">The funds have been transferred successfully.</p>
                <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 space-y-3 mb-8">
                  <p className="text-sm font-bold text-gray-400 uppercase">Amount Transferred</p>
                  <p className="text-4xl font-black text-gray-900">AED {parseFloat(transferAmount).toLocaleString()}</p>
                  <div className="h-px bg-gray-200 w-full my-4"></div>
                  <p className="text-gray-600 font-bold">
                    To: {recipientName || 'External Account'}
                  </p>
                  <p className="text-xs text-gray-400 font-bold">REF: RAK-{Math.floor(Date.now()/1000)}</p>
                </div>
                <button 
                  onClick={resetTransferForm}
                  className="btn-rak px-10 py-4 uppercase text-xs tracking-widest"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="bg-white p-10 rak-card shadow-xl space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Pay From</label>
                    <div className="rak-input bg-gray-50 flex justify-between items-center cursor-not-allowed">
                      <div>
                        <p className="font-bold text-gray-900">Current Account</p>
                        <p className="text-xs text-gray-500">AED {user.balance.toLocaleString()}</p>
                      </div>
                      <Landmark className="text-gray-300 w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Amount (AED)</label>
                    <input 
                      type="number"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full rak-input text-xl font-black"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Recipient Name</label>
                    <input 
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. Abdullah Ahmed"
                      className="w-full rak-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-3">IBAN / Account Number</label>
                    <input 
                      type="text"
                      value={iban}
                      onChange={(e) => setIban(e.target.value)}
                      placeholder="AE..."
                      className="w-full rak-input font-mono"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-2xl flex gap-4 items-start">
                   <Shield className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                   <div>
                     <p className="text-sm font-bold text-blue-900 mb-1">Secure Transfer</p>
                     <p className="text-xs text-blue-700/80 leading-relaxed">This transaction is protected by 256-bit encryption. A verification code may be sent to your registered mobile number.</p>
                   </div>
                </div>

                <button 
                  onClick={executeTransfer}
                  disabled={isTransferring || !transferAmount || !iban}
                  className={`w-full py-5 btn-rak flex items-center justify-center gap-3 text-sm uppercase tracking-widest ${isTransferring || !transferAmount || !iban ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  {isTransferring ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Confirm Transfer</>}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'assistant' && (
          <div className="flex flex-col h-[calc(100vh-18rem)] animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-14 h-14 bg-[#E11932] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-100">
                  <Smartphone className="w-7 h-7" />
               </div>
               <div>
                  <h2 className="text-2xl font-black text-gray-900">RAKBANK Smart Assistant</h2>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Simply Better Support</p>
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-white rak-card p-6 space-y-6 mb-6 no-scrollbar border border-gray-100 shadow-xl">
              {assistantMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 px-6 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#E11932] text-white' 
                      : 'bg-gray-50 text-gray-800 border border-gray-100'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAssistantLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-50 p-4 rounded-2xl flex gap-1.5 items-center border border-gray-100">
                    <div className="w-2 h-2 bg-[#E11932] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#E11932] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-[#E11932] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleAssistantSend} className="relative">
              <input 
                type="text"
                value={assistantInput}
                onChange={(e) => setAssistantInput(e.target.value)}
                placeholder="Ask me about your balance, transfers, or rewards..."
                className="w-full rak-input pr-16 py-5 shadow-lg border-gray-100"
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#E11932] text-white p-3 rounded-xl hover:bg-[#c41228] transition-all shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {activeTab === 'cards' && (
          <div className="animate-in fade-in duration-500 space-y-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900">My Cards</h2>
                <p className="text-gray-500 font-medium">Manage your plastic and digital cards</p>
              </div>
              <button className="flex items-center gap-2 bg-[#E11932] text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-[#c41228] transition-all shadow-lg shadow-red-100">
                <Plus className="w-5 h-5" /> Apply New
              </button>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#333333] rounded-[2rem] p-10 shadow-2xl relative overflow-hidden group cursor-pointer border border-white/5 max-w-md mx-auto aspect-[1.58/1]">
               <div className="absolute top-0 right-0 p-8">
                  <div className="rak-logo-icon text-white bg-transparent border-2 border-white/20">R</div>
               </div>
               
               <div className="relative z-10 flex flex-col h-full justify-between text-white">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.3em] opacity-40 uppercase mb-1">RAKBANK TITANIUM</p>
                    <Smartphone className="w-8 h-8 opacity-60" />
                  </div>

                  <div className="space-y-6">
                     <p className="font-mono text-2xl tracking-[0.2em] text-white/90">•••• •••• •••• 1284</p>
                     <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[8px] opacity-40 uppercase font-bold mb-1 tracking-widest">Card Holder</p>
                          <p className="text-lg font-bold tracking-wider uppercase">{user.name}</p>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="text-right">
                              <p className="text-[8px] opacity-40 uppercase font-bold mb-1">Expiry</p>
                              <p className="text-sm font-bold">08/28</p>
                           </div>
                           <div className="w-12 h-8 bg-white/10 rounded-md backdrop-blur-sm border border-white/5"></div>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#E11932]/10 rounded-full blur-3xl group-hover:bg-[#E11932]/20 transition-all duration-700"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {[
                 { label: 'Freeze Card', icon: Shield },
                 { label: 'Card PIN', icon: Smartphone },
                 { label: 'Limits', icon: TrendingUp },
                 { label: 'RAKrewards', icon: Globe }
               ].map((action, i) => (
                 <button key={i} className="bg-white p-6 rak-card flex flex-col items-center gap-4 group hover:border-[#E11932] transition-all border border-gray-50">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#E11932] group-hover:bg-red-50 transition-colors">
                      <action.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-xs font-bold uppercase text-gray-600 tracking-tighter">{action.label}</span>
                 </button>
               ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 h-20 flex items-center justify-around z-50 px-4">
        {[
          { id: 'accounts', label: 'Summary', icon: Landmark },
          { id: 'transfer', label: 'Transfer', icon: ArrowRightLeft },
          { id: 'cards', label: 'Cards', icon: CreditCard },
          { id: 'assistant', label: 'Ask RAK', icon: HelpCircle },
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id as any)} 
            className={`flex flex-col items-center gap-1.5 transition-all px-4 py-2 rounded-2xl ${activeTab === item.id ? 'text-[#E11932] bg-red-50/50' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </footer>
    </div>
  );
};

export default App;