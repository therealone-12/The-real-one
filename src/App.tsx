/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Crown, 
  ChevronRight, 
  Check, 
  Menu, 
  X, 
  ArrowRight, 
  Wine, 
  Music, 
  User, 
  Mail, 
  ShieldCheck, 
  Palmtree, 
  Sparkle, 
  Calendar, 
  MapPin, 
  Tv, 
  Phone,
  Ticket,
  ChevronDown
} from "lucide-react";

import { 
  TICKET_CATEGORIES, 
  TABLE_CATEGORIES, 
  TicketCategory,
  TableCategory
} from "./types";

// Define generated luxury photo assets
const royalGalaHall = "/src/assets/images/royal_gala_hall_1780944815703.png";
const vipLoungeLuxury = "/src/assets/images/vip_lounge_luxury_1780944845398.png";
const verandaLounge = "/src/assets/images/veranda_real_lounge_1780954590325.png";
const zapBeachClub = "/src/assets/images/zap_real_beach_1780954610004.png";

export default function App() {
  // Navigation & UI States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Tab Controls
  const [activeTab, setActiveTab] = useState<"tickets" | "tables">("tickets");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<"all" | "beach" | "floor1" | "floor2">("all");

  // Selector system for custom simulator
  const [bookingType, setBookingType] = useState<"ticket" | "table">("ticket");
  const [selectedTicketId, setSelectedTicketId] = useState(TICKET_CATEGORIES[0].id);
  const [selectedTableId, setSelectedTableId] = useState(TABLE_CATEGORIES[0].id);
  const [numTickets, setNumTickets] = useState(2);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Guest photo and list states
  const [attendeeImages, setAttendeeImages] = useState<{[key: number]: string}>({});
  const [attendeeNames, setAttendeeNames] = useState<{[key: number]: string}>({});

  const handleImageFileChange = (index: number, file: File | null) => {
    if (!file) {
      setAttendeeImages(prev => {
        const copy = { ...prev };
        delete copy[index];
        return copy;
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setAttendeeImages(prev => ({
          ...prev,
          [index]: e.target!.result as string
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const numGuests = bookingType === "ticket" ? numTickets : (TABLE_CATEGORIES.find(t => t.id === selectedTableId)?.capacity || 4);

  // Ticket Generator simulation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState("");
  const [virtualPass, setVirtualPass] = useState<{
    id: string;
    holderName: string;
    holderEmail: string;
    holderPhone: string;
    selectedItemName: string;
    priceFormatted: string;
    totalPriceFormatted: string;
    qrCodePattern: string;
    sealCode: string;
    entryDate: string;
    categoryBadge: string;
    attendees?: { name: string; image?: string }[];
  } | null>(null);

  // Scroll handler for transparent to glass header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Helper selectors
  const activeTicketObj = TICKET_CATEGORIES.find(t => t.id === selectedTicketId) || TICKET_CATEGORIES[0];
  const activeTableObj = TABLE_CATEGORIES.find(t => t.id === selectedTableId) || TABLE_CATEGORIES[0];

  const calculateSubtotal = () => {
    if (bookingType === "ticket") {
      return activeTicketObj.price * numTickets;
    } else {
      return activeTableObj.price;
    }
  };

  const getSubtotalFormatted = () => {
    return calculateSubtotal().toLocaleString("pt-PT") + " Kz";
  };

  const handleCreateReservation = (e: FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone) {
      alert("Por favor, preencha todos os campos reais.");
      return;
    }
    
    setIsGenerating(true);
    setProgressStep("Conectando aos servidores da Chancelaria Real...");

    setTimeout(() => {
      setProgressStep("Verificando disponibilidade de lote exclusivo na Ilha de Luanda...");
    }, 800);

    setTimeout(() => {
      setProgressStep("Gravando os perfis fotográficos criptografados no livro ouro...");
    }, 1600);

    setTimeout(() => {
      setProgressStep("Emitindo selo digital holográfico da Coroa com chancelas...");
    }, 2400);

    setTimeout(() => {
      const computedTotalNum = calculateSubtotal();
      const generatedId = `REALEZA-LUA-${Math.floor(10000 + Math.random() * 90000)}`;
      const sealRandomCode = `SELO-VIP-${Math.random().toString(36).substring(3, 8).toUpperCase()}`;
      
      const itemName = bookingType === "ticket" 
        ? `${activeTicketObj.name} (x${numTickets} Entradas)` 
        : `Mesa Reservada: ${activeTableObj.name} (${activeTableObj.area})`;

      // Gather attendees list with names and uploaded images
      const attendeesList = Array.from({ length: numGuests }).map((_, idx) => ({
        name: attendeeNames[idx] || `Convidado ${idx + 1}`,
        image: attendeeImages[idx] || undefined
      }));

      setVirtualPass({
        id: generatedId,
        holderName: clientName.toUpperCase(),
        holderEmail: clientEmail.toLowerCase(),
        holderPhone: clientPhone,
        selectedItemName: itemName,
        priceFormatted: bookingType === "ticket" ? `${activeTicketObj.price.toLocaleString("pt-PT")} Kz` : `${activeTableObj.price.toLocaleString("pt-PT")} Kz`,
        totalPriceFormatted: computedTotalNum.toLocaleString("pt-PT") + " Kz",
        qrCodePattern: `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${generatedId}`,
        sealCode: sealRandomCode,
        entryDate: "15 de Agosto de 2026",
        categoryBadge: bookingType === "ticket" ? activeTicketObj.badge : activeTableObj.name,
        attendees: attendeesList
      });
      setIsGenerating(false);
      setProgressStep("");

      // Smooth scroll to card result
      setTimeout(() => {
        document.getElementById("digital-pass")?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }, 3200);
  };

  const resetReservation = () => {
    setVirtualPass(null);
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setAttendeeImages({});
    setAttendeeNames({});
  };

  const getFilteredTables = () => {
    if (activeCategoryFilter === "all") return TABLE_CATEGORIES;
    if (activeCategoryFilter === "beach") return TABLE_CATEGORIES.filter(t => t.area.includes("Praia"));
    if (activeCategoryFilter === "floor1") return TABLE_CATEGORIES.filter(t => t.area.includes("1.º Piso"));
    if (activeCategoryFilter === "floor2") return TABLE_CATEGORIES.filter(t => t.area.includes("2.º Piso"));
    return TABLE_CATEGORIES;
  };

  return (
    <div className="relative min-h-screen bg-velvet-obsidian text-[#F5F2ED] font-sans selection:bg-gold selection:text-black">
      
      {/* Light subtle particles in background to emphasize royal glow */}
      <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-gold rounded-full blur-[1px] opacity-40"></div>
      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-gold rounded-full blur-[1px] opacity-65"></div>
      <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-gold rounded-full blur-[2px] opacity-45"></div>
      <div className="absolute bottom-10 left-10 w-1 h-1 bg-gold rounded-full blur-[1px] opacity-30"></div>

      {/* Elegant Golden Announcement Bar */}
      <div className="relative z-50 bg-black/90 border-b border-gold/25 text-[10px] md:text-xs tracking-[0.15em] text-center py-3 px-4 text-gold font-display flex items-center justify-center flex-wrap gap-2 md:gap-3">
        <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse shrink-0" />
        <span className="uppercase font-semibold text-gold-cream">PROPRIETÁRIOS • RESERVAS DE INGRESSOS E MESAS SUPREMAS</span>
        <span className="hidden md:inline-block h-3.5 w-px bg-gold/20 mx-2"></span>
        <a href="tel:+244958128978" className="font-sans text-stone-300 hover:text-white transition-colors flex items-center gap-1.5 font-medium">
          <Phone className="w-3.5 h-3.5 text-gold inline-block shrink-0" />
          +244 958 128 978
        </a>
      </div>

      {/* Floating Sticky Header */}
      <header className={`sticky top-0 z-40 transition-all duration-500 ${scrolled ? "bg-black/95 border-b border-gold/20 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.8)]" : "bg-transparent py-6"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-12 flex items-center justify-between">
          
          {/* Logo Brand Title */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 bg-zinc-950 border border-gold rounded-full group-hover:border-white transition-all duration-500 overflow-hidden shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <div className="absolute inset-0 bg-gradient-to-t from-gold-deep to-transparent opacity-60" />
              <Crown className="w-5 h-5 text-gold group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-[2px] border border-gold/10 rounded-full animate-[spin_30s_linear_infinite]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-[0.25em] text-gold-shimmer">LA REALEZA</span>
              <span className="text-[8px] tracking-[0.45em] uppercase text-stone-400 font-sans">Ilha de Luanda</span>
            </div>
          </a>

          {/* Navigational anchor links */}
          <nav className="hidden lg:flex items-center gap-10">
            <a href="#missao" className="text-[11px] uppercase tracking-[0.2em] font-sans text-stone-300 hover:text-gold transition-colors duration-300">
              A Missão
            </a>
            <a href="#experiencias" className="text-[11px] uppercase tracking-[0.2em] font-sans text-stone-300 hover:text-gold transition-colors duration-300">
              Categorias
            </a>
            <a href="#bilhetes" className="text-[11px] uppercase tracking-[0.2em] font-sans text-stone-300 hover:text-gold transition-colors duration-300">
              Bilhetes Oficiais
            </a>
            <a href="#mesas" className="text-[11px] uppercase tracking-[0.2em] font-sans text-stone-300 hover:text-gold transition-colors duration-300">
              Mesas Exclusivas
            </a>
            <a href="#reservas" className="text-[11px] uppercase tracking-[0.2em] font-sans text-[#D4AF37] font-semibold hover:text-[#B69145] transition-colors duration-300">
              Chancelaria Real
            </a>
          </nav>

          {/* Desktop Right Gold Accent Line or CTA */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="w-20 h-[1.5px] bg-gold/40"></div>
            <a href="#reservas" className="px-7 py-3 bg-gold hover:bg-[#B69145] text-black font-bold text-xs tracking-widest uppercase transition-all duration-300 ring-1 ring-gold ring-offset-4 ring-offset-black">
              Solicitar Convite
            </a>
          </div>

          {/* Mobile hamburger menu */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-gold hover:text-white border border-gold/20 p-2 rounded-lg bg-black/40 hover:bg-black/90 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-0 right-0 z-30 bg-black/95 backdrop-blur-xl border-b border-gold/30 px-6 py-8 flex flex-col gap-6 text-center select-none"
          >
            <a href="#missao" onClick={() => setMobileMenuOpen(false)} className="text-sm font-display tracking-widest text-stone-200 hover:text-gold">A MISSÃO</a>
            <a href="#experiencias" onClick={() => setMobileMenuOpen(false)} className="text-sm font-display tracking-widest text-stone-200 hover:text-gold">CATEGORIAS</a>
            <a href="#bilhetes" onClick={() => setMobileMenuOpen(false)} className="text-sm font-display tracking-widest text-stone-200 hover:text-gold">BILHETES</a>
            <a href="#mesas" onClick={() => setMobileMenuOpen(false)} className="text-sm font-display tracking-widest text-stone-200 hover:text-gold">MESAS DE LUXO</a>
            <a href="#reservas" onClick={() => setMobileMenuOpen(false)} className="text-sm font-display tracking-widest text-gold">RESERVAS</a>
            
            <a href="#reservas" onClick={() => setMobileMenuOpen(false)} className="bg-gold text-black py-3 px-6 text-xs uppercase tracking-widest font-bold font-display w-full max-w-xs mx-auto rounded-none hover:bg-gold-dark transition-all">
              REGISTAR ONLINE
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION - THE ROYAL BOX THEME */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center py-20 px-4 md:px-12 overflow-hidden">
        
        {/* Dynamic backdrop image */}
        <div className="absolute inset-0 z-0 scale-102 filter brightness-[0.22] saturate-[0.85] pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-velvet-obsidian via-velvet-obsidian/75 to-black/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#050505_90%)]" />
        </div>

        {/* Golden lines and glow layout */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-gold/50 to-transparent pointer-events-none hidden md:block" />

        <div className="relative z-10 max-w-5xl mx-auto text-center mt-6 flex flex-col items-center">
          
          {/* Top Label */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center"
          >
            <span className="text-gold text-xs tracking-[0.8em] md:tracking-[1.2em] uppercase mb-8 opacity-75 font-semibold text-center leading-relaxed">
              EXCLUSIVIDADE & ESPLENDOR
            </span>
            
            {/* Luxury Logo Title Box with Gold Corner Notches */}
            <div className="relative px-8 sm:px-14 md:px-20 py-8 sm:py-12 mb-10 max-w-full">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold"></div>
              
              <h1 className="font-display font-black text-4xl sm:text-7xl md:text-[96px] leading-none tracking-tighter text-center select-none text-gold-shimmer">
                LA REALEZA
              </h1>
            </div>
          </motion.div>

          {/* Highlight Luanda Sub-Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-col items-center gap-3.5 mb-10"
          >
            <div className="flex items-center gap-3 mb-1.5">
              <MapPin className="w-5 h-5 text-gold animate-[bounce_3s_infinite]" />
              <span className="text-base tracking-[0.25em] text-white uppercase font-display font-medium">Ilha de Luanda, Angola</span>
            </div>
            
            <p className="text-[#e0d5c0] text-lg md:text-2xl font-serif font-light italic max-w-2xl px-4 text-center select-text">
              "Experiência Exclusiva com Vista Panorâmica Suprema para o Mar e para a Cidade de Luanda"
            </p>
            

          </motion.div>

          {/* Main Action Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full max-w-md mx-auto"
          >
            <a 
              href="#reservas" 
              className="w-full sm:w-auto btn-primary-immersive"
            >
              Adquirir Bilhete
            </a>
            
            <a 
              href="#mesas" 
              className="w-full sm:w-auto btn-secondary-immersive"
            >
              Mesas Exclusivas
            </a>
          </motion.div>

          {/* Quick Stats Grid overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            transition={{ duration: 1.5, delay: 1.2 }}
            className="grid grid-cols-3 gap-6 md:gap-14 mt-16 pt-10 border-t border-gold/15 w-full max-w-3xl text-center"
          >
            <div className="flex flex-col">
              <span className="text-gold font-display text-xl md:text-2xl font-bold">3 FLOORS</span>
              <span className="text-[9px] uppercase tracking-widest text-stone-500 font-mono mt-1">Praia • Premium • VIP</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gold font-display text-xl md:text-2xl font-bold">20.000+ Kz</span>
              <span className="text-[9px] uppercase tracking-widest text-stone-500 font-mono mt-1">Lotes Iniciais</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gold font-display text-xl md:text-2xl font-bold">100% EXCLUSIVE</span>
              <span className="text-[9px] uppercase tracking-widest text-stone-500 font-mono mt-1">Vagas de Luxo</span>
            </div>
          </motion.div>

        </div>

        {/* Ambient bottom bleed design line */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-velvet-obsidian to-transparent z-10 pointer-events-none" />
      </section>

      {/* MISSÃO DO EVENTO / A ELEGÂNCIA DO PROPÓSITO */}
      <section id="missao" className="relative py-24 md:py-32 bg-black border-y border-gold/15 overflow-hidden">
        
        {/* Abstract luxury graphics */}
        <div className="absolute left-[5%] top-1/4 opacity-[0.03] rotate-12 pointer-events-none">
          <Crown className="w-96 h-96 text-gold" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Mission Statement Box */}
            <div className="lg:col-span-7 space-y-8">
              <div className="flex items-center gap-3">
                <span className="w-10 h-px bg-gold"></span>
                <span className="text-[10px] font-display text-gold tracking-[0.4em] uppercase font-bold">IDENTIDADE & VALOR</span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-display text-white tracking-wide font-black leading-tight">
                MISSÃO DO <span className="text-gold-gradient">EVENTO</span>
              </h2>

              <p className="font-serif italic text-xl md:text-2xl text-stone-300 leading-relaxed border-l-[3px] border-gold pl-6 py-1 my-6 font-light">
                &ldquo;LA REALEZA nasce com o objetivo de proporcionar uma experiência elegante, exclusiva e memorável, reunindo pessoas de valor num dos cenários mais bonitos de Luanda, com vista privilegiada para o mar e para a cidade.&rdquo;
              </p>

              <div className="flex flex-col gap-1">
                <p className="text-gold font-display tracking-[0.2em] uppercase text-sm mt-2">
                  "Mais do que um evento, uma experiência."
                </p>
                <p className="text-stone-400 font-sans font-light text-xs tracking-widest uppercase">
                  👑 LA REALEZA BRAND • LUANDA 2026
                </p>
              </div>

              {/* Icons bento list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center shrink-0 bg-gold-deep/10 text-gold">
                    <Palmtree className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-semibold text-white">Vista Infinita</h4>
                    <p className="text-xs text-stone-400 mt-1">
                      Cenário de tirar o fôlego olhando a Baía de Luanda inteira de qualquer nível do palácio de vidro.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center shrink-0 bg-gold-deep/10 text-gold">
                    <Wine className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-semibold text-white">Catering Superior</h4>
                    <p className="text-xs text-stone-400 mt-1">
                      Bebidas premium, snacks autorais e bar estruturado para cada piso com rapidez máxima.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Elegant Image panel with frame notches */}
            <div className="lg:col-span-5 relative w-full flex justify-center">
              <div className="relative p-3 bg-zinc-950 border border-gold/25 w-full max-w-sm rounded-none shadow-2xl">
                
                {/* Gold corner notches for decorative luxury */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gold -mt-1 -ml-1"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gold -mt-1 -mr-1"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-gold -mb-1 -ml-1"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gold -mb-1 -mr-1"></div>

                <div className="relative overflow-hidden aspect-[3/4] w-full bg-zinc-900">
                  <img 
                    src={verandaLounge} 
                    alt="La Realeza Atmosfera" 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-108 filter brightness-75 contrast-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  
                  {/* Floating visual watermark card */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/90 backdrop-blur-md border border-gold/20 text-center">
                    <Crown className="w-4.5 h-4.5 text-gold mx-auto mb-1 animate-pulse" />
                    <span className="font-display text-[10px] tracking-[0.25em] text-white block uppercase">Ilha de Luanda, Angola</span>
                    <span className="text-[8px] font-sans text-gold tracking-widest uppercase">Padrão de Qualidade Suprema</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* BILHETES & EXPERIÊNCIA DE CADA CATEGORIA */}
      <section id="experiencias" className="relative py-24 md:py-32 bg-stone-950/20">
        
        <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col items-center mb-16 text-center">
            <span className="text-[10px] font-display text-gold tracking-[0.4em] uppercase mb-4 block">PORTAIS DE ADMISSÃO</span>
            <h2 className="text-3xl md:text-5xl font-display text-white tracking-wide font-black">
              BILHETES <span className="text-gold-gradient">OFICIAIS</span>
            </h2>
            <div className="w-16 h-px bg-gold mt-6" />
            <p className="text-stone-400 font-sans font-light text-sm max-w-xl mx-auto mt-4 leading-relaxed/center">
              Selecione o nível de privilégio desejado na Ilha de Luanda. Ingressos limitados para manter a elegância do ambiente.
            </p>
          </div>

          {/* Ticket Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {TICKET_CATEGORIES.map((ticket, index) => {
              const isVip = ticket.id === "realeza_vip";
              const isPremium = ticket.id === "realeza_premium";
              
              return (
                <div 
                  key={ticket.id}
                  className={`relative flex flex-col justify-between p-8 bg-[#050505] border transition-all duration-500 rounded-none overflow-hidden ${isVip ? "border-gold shadow-[0_0_40px_rgba(212,175,55,0.2)] lg:-translate-y-4" : "border-gold/15 hover:border-gold/45 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"}`}
                >
                  {/* Decorative Glowing Backdrop */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl pointer-events-none`} />

                  {isVip && (
                    <div className="absolute top-0 right-0 bg-gold text-black uppercase text-[8px] font-bold tracking-[0.45em] py-1.5 px-5 font-display shadow-lg rotate-0">
                      Recomendado VIP
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        {/* Interactive icon visualization using standard crowns config */}
                        <div className="flex gap-2 items-center mb-1">
                          {ticket.icon === "Crown" && <Crown className="w-5.5 h-5.5 text-gold animate-[spin_10s_linear_infinite]" />}
                          {ticket.icon === "Sparkles" && <Sparkles className="w-5.5 h-5.5 text-gold animate-pulse" />}
                          {ticket.icon === "Palmtree" && <Palmtree className="w-5.5 h-5.5 text-gold" />}
                          <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-mono">{ticket.badge}</span>
                        </div>
                        <h3 className="font-display text-xl font-bold text-white tracking-wide mt-1">{ticket.name}</h3>
                      </div>
                    </div>

                    {/* Highly Immersive Price Figure */}
                    <div className="mb-6 pb-6 border-b border-gold/10">
                      <span className="text-[10px] text-stone-500 uppercase tracking-widest font-mono">VALOR DO BILHETE</span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl md:text-4xl font-display font-medium text-gold-shimmer font-mono">
                          {ticket.price.toLocaleString("pt-PT")}
                        </span>
                        <span className="text-stone-300 font-display text-sm tracking-widest font-semibold uppercase">Kz</span>
                      </div>
                    </div>

                    {/* Detailed Experience Category Statement */}
                    <div className="mb-6">
                      <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-display font-semibold block mb-2">EXPERIÊNCIA DA CATEGORIA</span>
                      <p className="text-xs text-stone-300 font-sans font-light leading-relaxed italic bg-gold-deep/5 p-3.5 border border-gold/10">
                        "{ticket.experience}"
                      </p>
                    </div>

                    {/* Benefits bullet list */}
                    <div className="space-y-3.5 mb-8">
                      <span className="text-[10px] text-stone-500 uppercase tracking-widest font-mono block">BENEFÍCIOS DE ADMISSÃO:</span>
                      {ticket.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs">
                          <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                          <span className="text-stone-300 font-sans font-light leading-relaxed">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions to selector */}
                  <div>
                    <a 
                      href="#reservas" 
                      onClick={() => {
                        setBookingType("ticket");
                        setSelectedTicketId(ticket.id);
                      }}
                      className={`w-full text-center py-3.5 px-6 font-display text-xs tracking-widest uppercase font-bold transition-all duration-300 block ${isVip ? "bg-gold text-black hover:bg-white" : "border border-gold/30 text-gold hover:bg-gold hover:text-black hover:border-gold"}`}
                    >
                      Selecionar {ticket.name.replace(/[^a-zA-Z\s]/g, '').trim()}
                    </a>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* EXCLUSIVE TABLES / MESAS EXCLUSIVAS */}
      <section id="mesas" className="relative py-24 md:py-32 bg-black border-y border-gold/15 overflow-hidden">
        
        {/* Abstract watermark */}
        <div className="absolute right-12 bottom-12 select-none z-0">
          <div className="watermark-prestige">PRESTIGE</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col items-center mb-16 text-center">
            <span className="text-[10px] font-display text-gold tracking-[0.4em] uppercase mb-4 block">EXPERIÊNCIA COLETIVA REFINADA</span>
            <h2 className="text-3xl md:text-5xl font-display text-white tracking-wide font-black">
              MESAS <span className="text-gold-gradient">EXCLUSIVAS</span>
            </h2>
            <div className="w-16 h-px bg-gold mt-6" />
            <p className="text-stone-400 font-sans font-light text-sm max-w-xl mx-auto mt-4 leading-relaxed">
              Ideal para círculos corporativos de alta estirpe ou grupos seletos. Desfrute de atendimento dedicado por garçons reais com a melhor visão da Baía de Luanda.
            </p>
          </div>

          {/* Area filter tabs */}
          <div className="flex justify-center flex-wrap gap-3 mb-10">
            {[
              { id: "all", label: "Todas as Áreas" },
              { id: "beach", label: "🌊 Área da Praia" },
              { id: "floor1", label: "✨ 1.º Piso" },
              { id: "floor2", label: "👑 2.º Piso Royal VIP" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategoryFilter(tab.id as any)}
                className={`px-5 py-2.5 rounded-none font-display text-[10px] uppercase tracking-widest transition-all duration-300 focus:outline-none ${activeCategoryFilter === tab.id ? "bg-gold text-black font-semibold" : "bg-[#0b0b0c] border border-gold/15 text-stone-300 hover:border-gold/50"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tables card list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {getFilteredTables().map((table) => {
              const isRoyalVip = table.area.includes("Royal");
              const isFloor1 = table.area.includes("1.º Piso");
              
              return (
                <div 
                  key={table.id}
                  className="flex flex-col justify-between p-6 bg-[#050505] border border-gold/10 hover:border-gold/45 shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-300"
                >
                  <div>
                    {/* Header: Area + Name */}
                    <div className="flex justify-between items-start mb-4 border-b border-gold/10 pb-4">
                      <div>
                        {/* Area tag */}
                        <div className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-[#D4AF37] font-sans font-semibold mb-2">
                          {isRoyalVip ? <Crown className="w-3.5 h-3.5 text-gold animate-[pulse_2s_infinite]" /> : <MapPin className="w-3.5 h-3.5 text-gold" />}
                          {table.area}
                        </div>
                        <h4 className="font-display text-lg font-bold text-white tracking-wide uppercase">{table.name}</h4>
                      </div>
                      <div className="bg-white/5 border border-white/5 text-[10px] uppercase font-semibold text-stone-300 px-2.5 py-1 font-mono">
                        {table.capacity} Dignitários
                      </div>
                    </div>

                    {/* Price structure */}
                    <div className="mb-5">
                      <span className="text-[9px] text-[#D4AF37] font-display uppercase tracking-widest block font-bold">VALOR DE RESERVA</span>
                      <div className="flex items-baseline gap-1 bg-gold-deep/10 border border-gold/15 p-2 px-3 mt-1 justify-between">
                        <span className="text-xs uppercase text-stone-400 font-sans">Mesa Completa</span>
                        <span className="text-xl font-display font-medium text-gold-shimmer font-mono">
                          {table.price.toLocaleString("pt-PT")} Kz
                        </span>
                      </div>
                    </div>

                    {/* Table-specific benefits */}
                    <div className="space-y-2 mb-6">
                      <span className="text-[9px] text-stone-500 uppercase tracking-widest font-mono block">BENEFÍCIOS EXCLUSIVOS DA MESA</span>
                      {table.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs justify-between">
                          <Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                          <span className="text-stone-300 font-sans font-light leading-relaxed text-left flex-1 pl-1">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions for Table selector */}
                  <div>
                    <a 
                      href="#reservas" 
                      onClick={() => {
                        setBookingType("table");
                        setSelectedTableId(table.id);
                      }}
                      className="w-full text-center py-2.5 px-4 bg-zinc-900 border border-gold/30 text-gold hover:bg-gold hover:text-black font-display text-[10px] tracking-widest uppercase font-semibold transition-all duration-300 block"
                    >
                      Reservar {table.name}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Global Benefits overview ribbon */}
          <div className="mt-14 p-6 bg-[#050505] border border-gold/20 flex flex-col md:flex-row justify-around items-center gap-6 text-center md:text-left">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-gold" />
              <div>
                <span className="text-xs font-display tracking-widest text-white uppercase block font-semibold">Segurança & Conforto Máximo</span>
                <span className="text-[10px] text-stone-400 font-sans block">Acesso privado vedado e restrito ao público exterior</span>
              </div>
            </div>
            <div className="w-px h-8 bg-gold/15 hidden md:block"></div>
            <div className="flex items-center gap-3">
              <Wine className="w-6 h-6 text-gold" />
              <div>
                <span className="text-xs font-display tracking-widest text-white uppercase block font-semibold">Atendimento Dedicado</span>
                <span className="text-[10px] text-stone-400 font-sans block">Serviço de alta hotelaria real focado no seu conforto</span>
              </div>
            </div>
            <div className="w-px h-8 bg-gold/15 hidden md:block"></div>
            <div className="flex items-center gap-3">
              <Tv className="w-6 h-6 text-gold animate-[pulse_2s_infinite]" />
              <div>
                <span className="text-xs font-display tracking-widest text-white uppercase block font-semibold">Vista 360º de Luanda</span>
                <span className="text-[10px] text-stone-400 font-sans block">Melhor ângulo de observação do horizonte costeiro</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* GALERIA EXCLUSIVA DO CENÁRIO DA ILHA DE LUANDA */}
      <section id="galeria" className="relative py-24 md:py-32 bg-black border-b border-gold/15 overflow-hidden">
        {/* Glow lights backdrop */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-gold-deep/5 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold-deep/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-10 text-center">
          
          <div className="flex flex-col items-center mb-16">
            <div className="flex items-center gap-1.5 justify-center mb-4">
              <div className="w-1.5 h-1.5 bg-gold rounded-full" />
              <span className="text-[10px] sm:text-xs tracking-[0.45em] uppercase text-gold font-display font-black">O TEMPLO DO BOM GOSTO</span>
              <div className="w-1.5 h-1.5 bg-gold rounded-full" />
            </div>
            
            <h2 className="text-3xl md:text-5xl font-display text-white tracking-wide font-black leading-tight">
              O Cenário Exclusivo de Frente para o Mar
            </h2>
            <div className="w-16 h-[2px] bg-gold mt-6 mb-5" />
            <p className="text-stone-400 font-sans font-light text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
              Explore a sumptuosidade física da nossa estrutura implantada sobre a mítica Ilha de Luanda, projetada para fundir a sofisticação moderna com a beleza eterna do mar Angolano.
            </p>
          </div>

          {/* Golden Grid of real venue images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Image 1 */}
            <div className="group relative flex flex-col bg-zinc-950/40 border border-gold/15 hover:border-gold/35 transition-all duration-500 rounded-none overflow-hidden shadow-2xl">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-900 border-b border-gold/10">
                <img 
                  src={verandaLounge} 
                  alt="O Lounge da Veranda" 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-black/85 border border-gold/25 px-2.5 py-1 text-[8px] font-mono tracking-widest text-gold uppercase">
                  Deck Superior
                </div>
              </div>
              <div className="p-6 text-left">
                <h3 className="font-display text-sm font-semibold tracking-wide text-white uppercase mb-2 flex items-center gap-2">
                  <span className="text-gold">I.</span> O Lounge da Veranda
                </h3>
                <p className="text-stone-400 font-sans text-xs font-light leading-relaxed">
                  Espaço exclusivo sob drapes e toldos flutuantes, apresentando uma vista de cortar a respiração sobre os arranha-céus da Baía e o infinito mar da Ilha de Luanda.
                </p>
              </div>
            </div>

            {/* Image 2 */}
            <div className="group relative flex flex-col bg-[#050505] border border-gold/15 hover:border-gold/35 transition-all duration-500 rounded-none overflow-hidden shadow-2xl">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-900 border-b border-gold/10">
                <img 
                  src={verandaLounge} 
                  alt="O Terraço do Mar" 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-black/85 border border-gold/25 px-2.5 py-1 text-[8px] font-mono tracking-widest text-gold uppercase">
                  Área da Praia
                </div>
              </div>
              <div className="p-6 text-left">
                <h3 className="font-display text-sm font-semibold tracking-wide text-white uppercase mb-2 flex items-center gap-2">
                  <span className="text-gold">II.</span> O Terraço do Mar
                </h3>
                <p className="text-stone-400 font-sans text-xs font-light leading-relaxed">
                  Assentos ao ar livre pavimentados em deck de madeira e rodeados de palmeiras, projetados para receber a suavidade da brisa atlântica nos fins de tarde.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* EXCLUSIVO CHANCELARIA REAL / INTERACTIVE PLANNER & PASS GENERATOR */}
      <section id="reservas" className="relative py-24 md:py-32 bg-stone-950/40 z-10">
        
        {/* Glow backdrop decorator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-deep/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col items-center mb-16 text-center">
            <span className="text-[10px] font-display text-gold tracking-[0.4em] uppercase mb-4 block">SERVIÇO DE CHANCELARIA DIGITAL</span>
            <h2 className="text-3xl md:text-5xl font-display text-white tracking-wide font-black">
              SOLICITAÇÃO DE <span className="text-gold-gradient">CONVITE</span>
            </h2>
            <div className="w-16 h-px bg-gold mt-6" />
            <p className="text-stone-400 font-sans font-light text-sm max-w-xl mx-auto mt-4 leading-relaxed">
              Complete os dados reais da sua linhagem para solicitar o passe digital oficial de valor da marca La Realeza. Obtenha a confirmação de valor em tempo real.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Form & Selection Options - LG Column Span 6 */}
            <div className="lg:col-span-6 p-8 bg-[#050505] border border-gold/15 flex flex-col justify-between">
              
              <form onSubmit={handleCreateReservation} className="space-y-6">
                
                {/* Switch between Ticketing and Table reserves */}
                <div className="flex bg-[#0b0b0c] p-1 border border-gold/15 gap-1 mb-8">
                  <button
                    type="button"
                    onClick={() => {
                      setBookingType("ticket");
                      setVirtualPass(null);
                    }}
                    className={`flex-1 py-3 font-display uppercase tracking-wider text-[11px] transition-all focus:outline-none ${bookingType === "ticket" ? "bg-gold text-black font-bold" : "text-stone-300 hover:text-gold"}`}
                  >
                    Comprar Bilhetes Individuais
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBookingType("table");
                      setVirtualPass(null);
                    }}
                    className={`flex-1 py-3 font-display uppercase tracking-wider text-[11px] transition-all focus:outline-none ${bookingType === "table" ? "bg-gold text-black font-bold" : "text-stone-300 hover:text-gold"}`}
                  >
                    Reservar Mesas de Grupo
                  </button>
                </div>

                {/* Sub configuration options based on Selection */}
                {bookingType === "ticket" ? (
                  <div className="space-y-5 animate-fadeIn">
                    <div>
                      <label className="text-xs uppercase text-gold tracking-widest font-display block mb-2">Selecione o Bilhete de Destino</label>
                      <select 
                        value={selectedTicketId}
                        onChange={(e) => {
                          setSelectedTicketId(e.target.value);
                          setVirtualPass(null);
                        }}
                        className="w-full bg-[#0b0b0c] border border-gold/25 p-3.5 text-stone-200 focus:outline-none focus:border-gold text-xs font-sans rounded-none cursor-pointer"
                      >
                        {TICKET_CATEGORIES.map(t => (
                          <option key={t.id} value={t.id} className="bg-black text-stone-200">
                            {t.name} - {t.price.toLocaleString("pt-PT")} Kz
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs uppercase text-gold tracking-widest font-display">Número de Entradas</label>
                        <span className="font-mono text-gold font-bold text-xs bg-gold-deep/20 border border-gold/30 p-1 px-2.5">
                          {numTickets} Bilhetes
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min={1} 
                        max={15} 
                        value={numTickets}
                        onChange={(e) => {
                          setNumTickets(Number(e.target.value));
                          setVirtualPass(null);
                        }}
                        className="w-full accent-gold bg-[#0b0b0c] h-1.5 focus:outline-none cursor-pointer"
                      />
                      <p className="text-[10px] text-stone-500 font-mono mt-1 text-right">Mín: 1 / Máx: 15 bilhetes individuais</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5 animate-fadeIn">
                    <div>
                      <label className="text-xs uppercase text-gold tracking-widest font-display block mb-2">Escolha a Mesa & Área Almejada</label>
                      <select 
                        value={selectedTableId}
                        onChange={(e) => {
                          setSelectedTableId(e.target.value);
                          setVirtualPass(null);
                        }}
                        className="w-full bg-[#0b0b0c] border border-gold/25 p-3.5 text-stone-200 focus:outline-none focus:border-gold text-xs font-sans rounded-none cursor-pointer"
                      >
                        {TABLE_CATEGORIES.map(t => (
                          <option key={t.id} value={t.id} className="bg-black text-stone-200">
                            [{t.area}] {t.name} ({t.capacity} cap) - {t.price.toLocaleString("pt-PT")} Kz
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Persona data */}
                <hr className="border-gold/10" />

                <div className="space-y-4 pt-1">
                  <div>
                    <label className="text-[10px] uppercase text-stone-400 tracking-wider block mb-1">Nome Completo do Titular de Honra</label>
                    <div className="relative">
                      <User className="absolute left-3 top-[13px] w-4.5 h-4.5 text-gold/60" />
                      <input 
                        type="text" 
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Ex: EXMO. SENHOR EDUARDO BANDEIRA"
                        className="w-full bg-[#0b0b0c] border border-gold/25 p-3 pl-10 text-stone-200 focus:outline-none focus:border-gold text-xs font-sans rounded-none placeholder:text-stone-650"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase text-stone-400 tracking-wider block mb-1">Endereço de Correio Eletrónico</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-[13px] w-4.5 h-4.5 text-gold/60" />
                        <input 
                          type="email" 
                          required
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="nome@domínio.com"
                          className="w-full bg-[#0b0b0c] border border-gold/25 p-3 pl-10 text-stone-200 focus:outline-none focus:border-gold text-xs font-sans rounded-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase text-stone-400 tracking-wider block mb-1">Telemóvel Real de Contacto</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-[13px] w-4.5 h-4.5 text-gold/60" />
                        <input 
                          type="text" 
                          required
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="Ex: +244 9XX XXX XXX"
                          className="w-full bg-[#0b0b0c] border border-gold/25 p-3 pl-10 text-stone-200 focus:outline-none focus:border-gold text-xs font-sans rounded-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* DYNAMIC ATTENDEE PHOTO UPLOADS AS REQUESTED */}
                <div className="mt-6 space-y-4 border-t border-gold/10 pt-6">
                  <div className="flex items-center gap-2">
                    <Sparkle className="w-4 h-4 text-gold animate-spin-slow animate-pulse" />
                    <span className="text-xs uppercase text-gold tracking-widest font-display font-medium">
                      Fotografia de Acesso Individual ({numGuests} {numGuests === 1 ? "Pessoa" : "Pessoas"})
                    </span>
                  </div>
                  
                  <p className="text-[10px] text-stone-400 font-sans leading-relaxed">
                    Em conformidade com o protocolo real de alta classe da Ilha de Luanda, carregue uma foto frontal para cada um dos convidados do pedido.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-1">
                    {Array.from({ length: numGuests }).map((_, index) => {
                      const guestNum = index + 1;
                      const hasImg = !!attendeeImages[index];
                      return (
                        <div key={index} className="bg-black/40 border border-gold/15 p-3 flex flex-col gap-2 rounded-none hover:border-gold/30 transition-all">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-stone-300 font-mono tracking-widest uppercase font-bold">Pessoa {guestNum}</span>
                            {hasImg && (
                              <span className="text-[8px] bg-emerald-500/10 text-emerald-400 font-mono py-0.5 px-2 border border-emerald-500/20 uppercase">
                                Carregado
                              </span>
                            )}
                          </div>

                          {/* Guest Name input */}
                          <input
                            type="text"
                            value={attendeeNames[index] || ""}
                            onChange={(e) => setAttendeeNames(prev => ({ ...prev, [index]: e.target.value }))}
                            placeholder={`Ex: Nome do Convidado ${guestNum}`}
                            className="w-full bg-[#050505] border border-gold/15 p-2 text-stone-200 focus:outline-none focus:border-gold text-xs font-sans rounded-none placeholder:text-stone-700"
                          />

                          {/* Image Selector */}
                          <div className="relative h-20 border border-dashed border-gold/20 hover:border-gold/40 transition-colors flex items-center justify-center bg-[#050505]/50 group select-none overflow-hidden">
                            {hasImg ? (
                              <div className="absolute inset-0 flex items-center justify-between p-2">
                                <img 
                                  src={attendeeImages[index]} 
                                  alt={`Pessoa ${guestNum}`} 
                                  className="h-full w-16 object-cover border border-gold/20"
                                />
                                <div className="flex flex-col items-end gap-1">
                                  <span className="text-[8px] text-stone-400 font-sans truncate w-24 text-right">Foto Pronta</span>
                                  <button 
                                    type="button"
                                    onClick={() => handleImageFileChange(index, null)}
                                    className="text-[8px] text-red-400 hover:text-red-300 uppercase font-mono tracking-widest cursor-pointer"
                                  >
                                    Remover
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <label className="cursor-pointer w-full h-full flex flex-col justify-center items-center p-2 text-center">
                                <div className="flex flex-col items-center gap-1">
                                  <Sparkles className="w-4 h-4 text-gold/45 group-hover:text-gold transition-colors" />
                                  <span className="text-[9px] uppercase tracking-wider text-stone-400 group-hover:text-gold transition-colors font-sans">Escolher Foto</span>
                                  <span className="text-[7px] text-stone-600 font-mono">JPG, PNG de alta qualidade</span>
                                </div>
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    handleImageFileChange(index, file);
                                  }}
                                  className="hidden" 
                                />
                              </label>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-2">
                  <input 
                    type="checkbox" 
                    id="terms-accepted" 
                    required
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="accent-gold mt-1 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="terms-accepted" className="text-[10px] text-stone-400 font-sans leading-relaxed select-none cursor-pointer">
                    Confirmo que as informações prestadas são autênticas e estou de acordo com o protocolo elegante e sigiloso do selo exclusivo La Realeza.
                  </label>
                </div>

                <div className="pt-4">
                  {/* Generated button loader */}
                  {isGenerating ? (
                    <div className="w-full p-4 bg-gold-deep/20 text-center border border-gold/40 flex flex-col items-center gap-2">
                      <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] uppercase tracking-widest text-gold font-mono">{progressStep}</span>
                    </div>
                  ) : (
                    <button 
                      type="submit"
                      className="w-full py-4 bg-gold hover:bg-[#B69145] text-black font-bold uppercase tracking-widest text-xs font-display transition-all ring-1 ring-gold ring-offset-4 ring-offset-[#050505]"
                    >
                      Processar Confirmação Suprema
                    </button>
                  )}
                </div>

              </form>

            </div>

            {/* Generated pass / interactive result showcase block - LG Column Span 6 */}
            <div className="lg:col-span-6 flex flex-col justify-between align-stretch">
              
              <AnimatePresence mode="wait">
                {virtualPass ? (
                  <motion.div 
                    id="digital-pass"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="h-full relative flex flex-col justify-between p-8 bg-zinc-950 border border-gold border-double rounded-none shadow-[0_0_50px_rgba(212,175,55,0.15)] overflow-hidden min-h-[500px]"
                  >
                    {/* Background gold sheen circles */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08)_0%,transparent_60%)] pointer-events-none" />

                    {/* Ticket Front Branding Header */}
                    <div className="flex justify-between items-start border-b-2 border-gold/20 pb-6 mb-6">
                      <div className="flex items-center gap-2.5">
                        <Crown className="w-6 h-6 text-gold animate-[spin_8s_linear_infinite]" />
                        <div>
                          <span className="text-[9px] tracking-[0.3em] uppercase text-stone-500 font-mono block">CHANCELARIA REAL DE ANGOLA</span>
                          <span className="font-display text-xs font-black text-white tracking-widest uppercase mt-0.5">BILHETE DE HONRA OFICIAL</span>
                        </div>
                      </div>
                      <span className="bg-gold text-black text-[9px] font-bold tracking-widest uppercase font-mono px-2.5 py-1">
                        Série Ouro
                      </span>
                    </div>

                    {/* Pass center content */}
                    <div className="space-y-6 flex-grow">
                      <div>
                        <span className="text-[9px] text-stone-550 uppercase tracking-widest block font-mono">AUTORIDADE DE EXPEDIÇÃO</span>
                        <p className="font-display text-[15px] text-gold-shimmer font-bold tracking-wide uppercase mt-1">LA REALEZA • ILHA DE LUANDA</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[9px] text-stone-500 uppercase tracking-widest block font-mono">CONVIDADO DE HONRA</span>
                          <p className="text-white text-xs font-semibold tracking-wide font-sans mt-1">{virtualPass.holderName}</p>
                        </div>
                        <div>
                          <span className="text-[9px] text-stone-500 uppercase tracking-widest block font-mono">CONTACTO REGISTADO</span>
                          <p className="text-white text-xs font-mono font-bold mt-1">{virtualPass.holderPhone}</p>
                        </div>
                      </div>

                      <div className="bg-[#050505] p-4 border border-gold/20 flex justify-between items-center gap-3">
                        <div>
                          <span className="text-[9px] text-[#D4AF37] font-display uppercase tracking-widest font-semibold block">CONVITE ADQUIRIDO</span>
                          <span className="text-xs text-white uppercase font-sans font-medium mt-1 block">{virtualPass.selectedItemName}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[9px] text-stone-500 uppercase font-mono block">VALOR TOTAL</span>
                          <span className="text-sm font-mono font-bold text-gold-shimmer block mt-1">{virtualPass.totalPriceFormatted}</span>
                        </div>
                      </div>

                      {/* Attending guests list and uploaded photos */}
                      {virtualPass.attendees && virtualPass.attendees.length > 0 && (
                        <div className="border-t border-gold/15 pt-4 mt-1">
                          <span className="text-[9px] text-[#D4AF37] font-display uppercase tracking-widest font-bold block mb-2">Imagens de Acesso Autorizadas</span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {virtualPass.attendees.map((a, i) => (
                              <div key={i} className="flex items-center gap-1.5 bg-black/45 border border-gold/15 p-1.5 overflow-hidden">
                                {a.image ? (
                                  <img 
                                    src={a.image} 
                                    alt={a.name} 
                                    className="w-8 h-8 rounded-none object-cover border border-gold/30 shrink-0"
                                  />
                                ) : (
                                  <div className="w-8 h-8 bg-zinc-900 border border-gold/15 flex items-center justify-center shrink-0">
                                    <User className="w-3.5 h-3.5 text-gold/35" />
                                  </div>
                                )}
                                <div className="min-w-0 pr-0.5">
                                  <p className="text-[8.5px] text-white font-sans font-medium truncate uppercase tracking-wider">{a.name}</p>
                                  <p className="text-[7px] text-stone-550 font-mono tracking-widest uppercase">Passe {i + 1}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 items-center">
                        <div className="space-y-2">
                          <div>
                            <span className="text-[9px] text-stone-500 uppercase tracking-widest block font-mono">LOCALIZAÇÃO DO PORTAL</span>
                            <p className="text-stone-300 text-[11px] font-sans font-light mt-0.5">Ilha de Luanda, Angola - Vista Panorâmica para o Baía</p>
                          </div>
                        </div>

                        {/* Interactive Simulated QR Code */}
                        <div className="flex flex-col items-end">
                          <div className="bg-white p-2.5 inline-block border-2 border-gold shadow-lg">
                            <img 
                              src={virtualPass.qrCodePattern} 
                              alt="Selo Digital"
                              className="w-20 h-20 opacity-90 select-text pointer-events-auto"
                            />
                          </div>
                          <span className="text-[8px] text-stone-500 font-mono mt-2 tracking-widest">REGISTO ID: {virtualPass.id}</span>
                        </div>
                      </div>
                    </div>

                    {/* Foot Seal details */}
                    <div className="pt-6 border-t border-gold/20 mt-6 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-[8px] text-stone-550 uppercase tracking-widest block font-mono">CÓDIGO DE SEGURANÇA SEGREDO</span>
                        <span className="text-gold font-mono font-semibold text-[10px]">{virtualPass.sealCode}</span>
                      </div>
                      
                      <button 
                        onClick={resetReservation}
                        className="flex items-center gap-1.5 text-[10px] text-stone-400 hover:text-gold uppercase font-display tracking-widest transition-colors font-semibold"
                      >
                        <User className="w-3.5 h-3.5 text-gold" />
                        Nova Reserva
                      </button>
                    </div>

                  </motion.div>
                ) : (
                  <div className="h-full relative flex flex-col justify-center items-center p-8 bg-zinc-950/30 border border-white/5 py-12 text-center min-h-[500px]">
                    <div className="w-16 h-16 rounded-full border border-gold/20 bg-[#050505] flex items-center justify-center mb-6 text-gold relative">
                      <Crown className="w-7 h-7 text-gold animate-pulse" />
                      {/* Outward radar pulse animation */}
                      <div className="absolute inset-0 rounded-full border border-gold/30 scale-125 animate-[ping_2.5s_infinite]" />
                    </div>

                    <h4 className="font-display text-lg text-white font-black tracking-widest uppercase mb-2">AGUARDANDO SOLICITAÇÃO</h4>
                    <p className="text-stone-400 font-sans font-light text-xs max-w-sm mx-auto leading-relaxed mb-6">
                      Preencha o formulário eletrónico à esquerda com o seu nome e telemóvel real para estampar a luxuosa declaração de admissão dourada.
                    </p>

                    <div className="p-4 bg-gold-deep/5 border border-gold/15 max-w-sm text-left">
                      <span className="text-[9px] font-display font-bold uppercase tracking-widest text-[#D4AF37] block mb-1">
                        🌊 Nota de Exclusividade
                      </span>
                      <p className="text-[10px] text-stone-300 font-sans font-light leading-relaxed">
                        Exclusivo para homens e mulheres de valor. Todos os passes de admissão contêm criptografia de QR Code individualizada para apresentação nos portões da entrada prioritária em Luanda.
                      </p>
                    </div>
                  </div>
                )}
              </AnimatePresence>

            </div>

          </div>

        </div>
      </section>



      {/* FOOTER - THE HIGH SOCIETY PORTAL */}
      <footer className="relative bg-black text-[#F5F2ED] border-t border-gold/15 py-16 px-4 md:px-12 overflow-hidden">
        
        {/* Absolute visual watermark Prestige from config */}
        <div className="absolute bottom-6 right-6 select-none opacity-5 transition-all">
          <div className="text-[75px] md:text-[140px] font-display font-black leading-none text-[#D4AF37]">
            LUANDA
          </div>
        </div>

        <div className="max-w-7xl mx-auto z-10 relative">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 items-start">
            
            {/* Branding Column - Col span 4 */}
            <div className="md:col-span-4 space-y-6 text-left">
              <div className="flex items-center gap-3">
                <Crown className="w-7 h-7 text-gold" />
                <span className="font-display tracking-[0.25em] text-lg font-bold text-white">LA REALEZA</span>
              </div>
              
              <p className="text-xs text-stone-400 font-sans font-light leading-relaxed max-w-sm">
                Concebido sob o mais rigoroso protocolo de luxo costeiro. Memória esculpida em ouro para a alta comemoração de valor de Luanda.
              </p>

              <div className="flex items-center gap-4">
                <span className="text-[9px] tracking-widest uppercase text-gold font-display font-bold">Siga a Nobreza</span>
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-[1px] bg-gold/30"></div>
                  <div className="w-2.5 h-2.5 border border-gold rotate-45 shrink-0 bg-gold/10"></div>
                  <div className="w-2.5 h-2.5 border border-gold rotate-45 shrink-0 bg-gold/10"></div>
                </div>
              </div>
            </div>

            {/* Event schedule Column - Col span 4 */}
            <div className="md:col-span-4 space-y-4 text-left">
              <span className="text-[10px] uppercase tracking-wider text-gold font-display block font-black">LOCALIZAÇÃO</span>
              
              <div className="space-y-4">
                <div className="flex gap-3 items-start text-xs">
                  <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-display text-white font-medium block">Ilha de Luanda</span>
                    <span className="text-stone-400 font-sans font-light block">Luanda, Angola. Vista panorâmica completa da península</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick action maps Column - Col span 4 */}
            <div className="md:col-span-4 space-y-6 text-left">
              <span className="text-[10px] uppercase tracking-wider text-gold font-display block font-black">CENTRAL DE SUPORTE REAL</span>
              
              <div className="space-y-3.5">
                <p className="text-[11px] text-stone-400 font-sans leading-relaxed">
                  Para assessores privados de imprensa e agendamentos de mesas de valor supremo corporativos:
                </p>
                <div className="font-mono text-gold font-bold text-sm tracking-wide">
                  <a href="tel:+244958128978" className="hover:text-white transition-colors flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                    +244 958 128 978
                  </a>
                </div>
                <div className="font-sans text-xs text-stone-400">
                  Comunicação Direta Garantida
                </div>
              </div>

            </div>

          </div>

          <div className="border-t border-gold/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
            <span className="text-[10px] text-stone-500 font-mono tracking-widest">
              © {new Date().getFullYear()} LA REALEZA BRAND • TODOS OS DIREITOS DE SOBERANIA RESERVADOS
            </span>
            <div className="flex gap-6 text-[10px] text-stone-550 font-mono uppercase tracking-wider">
              <a href="#missao" className="hover:text-gold transition-colors">A Missão</a>
              <span className="text-gold/20">•</span>
              <a href="#bilhetes" className="hover:text-gold transition-colors">Bilhetes</a>
              <span className="text-gold/20">•</span>
              <a href="#mesas" className="hover:text-gold transition-colors">Mesas de Luxo</a>
            </div>
          </div>

        </div>

      </footer>

    </div>
  );
}
