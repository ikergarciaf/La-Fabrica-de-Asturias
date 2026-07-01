/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Instagram, 
  MapPin, 
  Phone, 
  Mail, 
  ChefHat, 
  Clock, 
  Menu as MenuIcon, 
  X, 
  ArrowRight,
  Utensils,
  Truck,
  Send,
  Star,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { MENU_ITEMS, BRAND, TESTIMONIALS } from './constants';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  imagePosition: string;
  imageScale?: string;
  price: string;
  tags: string[];
  badges?: string[];
  allergens?: string[];
  longDescription?: string;
}

const Modal = ({ item, onClose }: { item: MenuItem; onClose: () => void }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
    >
      <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-md" onClick={onClose} />
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative glass-card bg-zinc-950 border-white/10 w-full max-w-5xl max-h-[90vh] md:max-h-[85vh] rounded-[2rem] md:rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-10 h-10 md:w-12 md:h-12 bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 hover:bg-brand-primary hover:text-brand-dark transition-all"
        >
          <X size={20} className="md:w-6 md:h-6" />
        </button>
        
        <div className="w-full md:w-1/2 relative h-[250px] sm:h-[350px] md:h-auto shrink-0 overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-full h-full object-cover"
              style={{ 
                objectPosition: item.imagePosition || 'center',
                transform: item.imageScale ? `scale(${item.imageScale})` : undefined
              }}
              referrerPolicy="no-referrer"
            />
          </div>
          {item.badges?.map((badge: string) => (
            <div key={badge} className="absolute top-6 left-6 md:top-8 md:left-8 bg-brand-primary text-brand-dark font-display text-lg md:text-xl px-4 md:px-6 py-1.5 md:py-2 uppercase transform -rotate-1 shadow-xl">
              {badge}
            </div>
          ))}
        </div>

        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 lg:p-12 overflow-y-auto max-h-[calc(90vh-250px)] sm:max-h-[calc(90vh-350px)] md:max-h-none flex flex-col">
          <div className="mb-4 md:mb-8">
            <span className="text-brand-primary font-serif italic text-base md:text-xl mb-1 md:mb-2 block">{item.category}</span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl uppercase leading-none">{item.name}</h2>
          </div>

          <div className="space-y-4 md:space-y-6 flex-grow mb-6 md:mb-10">
            <div>
              <h4 className="text-[10px] uppercase font-bold tracking-[0.3em] text-zinc-500 mb-3">Descripción</h4>
              <p className="text-zinc-300 font-light leading-relaxed">{item.longDescription || item.description}</p>
            </div>

            <div>
              <h4 className="text-[10px] uppercase font-bold tracking-[0.3em] text-zinc-500 mb-3">Información Alérgenos</h4>
              <div className="flex flex-wrap gap-2">
                {item.allergens?.map((allergen: string) => (
                  <span key={allergen} className="px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] uppercase font-bold text-zinc-400">
                    {allergen}
                  </span>
                )) || <span className="text-zinc-500 text-xs italic">Consultar con el personal</span>}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <a 
              href="#localizacion" 
              onClick={onClose}
              className="w-full bg-brand-primary text-brand-dark py-5 rounded-2xl font-display text-2xl uppercase hover:bg-white transition-colors flex items-center justify-center gap-3"
            >
              Dónde Estamos <ArrowRight size={20} />
            </a>
            <p className="text-[10px] font-bold text-zinc-500 text-center uppercase tracking-widest">Servicio rápido disponible en el local</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Hamburguesas');
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');
  const [cookieConsent, setCookieConsent] = useState<'accepted' | 'rejected' | 'pending'>('pending');
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', details: '' });
  const scrollRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { threshold: 0.3 });

    const sections = ['inicio', 'la-carta', 'nosotros', 'eventos', 'contacto', 'localizacion'];
    sections.forEach(s => {
      const el = document.getElementById(s);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const storedConsent = window.localStorage.getItem('lafabrica-cookie-consent');
    if (storedConsent === 'accepted' || storedConsent === 'rejected') {
      setCookieConsent(storedConsent as 'accepted' | 'rejected');
    }
  }, []);

  useEffect(() => {
    if (cookieConsent !== 'pending') {
      window.localStorage.setItem('lafabrica-cookie-consent', cookieConsent);
    }
  }, [cookieConsent]);

  const categories = Array.from(new Set(MENU_ITEMS.map(item => item.category)));
  const filteredItems = (MENU_ITEMS as MenuItem[]).filter(item => item.category === activeCategory);
  const upcomingEvents = [
    {
      title: 'Festival de la Sidra',
      date: '12 jul · Gijón',
      description: 'Tarde de música, sidra y nuestras burgers más demandadas frente al mar.',
      link: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Festival%20de%20la%20Sidra%20-%20La%20F%C3%A1brica%20de%20Asturias&dates=20260712T180000/20260712T230000&details=Reserva%20tu%20plaza%20en%20el%20festival%20con%20La%20F%C3%A1brica%20de%20Asturias&location=Gij%C3%B3n'
    },
    {
      title: 'Cata de Burgers',
      date: '20 jul · Móstoles',
      description: 'Noche de sabor con maridaje de cerveza asturiana y una selección premium.',
      link: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Cata%20de%20Burgers%20-%20La%20F%C3%A1brica%20de%20Asturias&dates=20260720T200000/20260720T230000&details=Una%20noche%20especial%20para%20probar%20nuestras%20mejores%20burgers&location=M%C3%B3stoles'
    },
    {
      title: 'Fiesta de Empresa',
      date: '2 ago · Madrid',
      description: 'Catering para equipos y celebraciones con servicio rápido y menú a medida.',
      link: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Fiesta%20de%20Empresa%20-%20La%20F%C3%A1brica%20de%20Asturias&dates=20260802T190000/20260802T230000&details=Evento%20para%20empresas%20con%20catering%20de%20La%20F%C3%A1brica%20de%20Asturias&location=Madrid'
    }
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('sending');
    setFormError('');

    try {
      const response = await fetch('https://formsubmit.co/ajax/ikergarciaf@gmail.com', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: new URLSearchParams({
          name: formData.name,
          email: formData.email,
          message: formData.details,
          _subject: 'Nueva solicitud de evento - La Fábrica de Asturias',
          _captcha: 'false',
        })
      });

      if (!response.ok) {
        throw new Error('No se ha podido enviar el mensaje');
      }

      setFormData({ name: '', email: '', details: '' });
      setFormStatus('success');
    } catch (error) {
      setFormStatus('error');
      setFormError('No se ha podido enviar el formulario automáticamente. Escríbenos directamente a sidreriaelembarcadero@hotmail.com.');
    }
  };

  return (
    <div className="min-h-screen selection:bg-brand-primary selection:text-brand-dark overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-[100] flex justify-between items-center px-6 md:px-12 transition-all duration-300 ${
        isScrolled ? 'bg-brand-dark/95 backdrop-blur-md py-3 shadow-2xl border-b border-white/5' : 'bg-transparent py-6'
      }`}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <img 
            src={BRAND.logo} 
            alt="Logo" 
            className="w-16 h-16 md:w-24 md:h-24 object-contain" 
            referrerPolicy="no-referrer"
          />
          <span className="font-display text-xl md:text-2xl tracking-widest text-white uppercase hidden lg:block">
            {BRAND.name}
          </span>
        </motion.div>

        <div className="hidden md:flex gap-8 items-center text-white">
          {['Inicio', 'La Carta', 'Nosotros', 'Eventos', 'Localización'].map((item) => {
            const sectionId = item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
            const isActive = activeSection === sectionId;
            return (
              <a 
                key={item} 
                href={`#${sectionId}`}
                className={`font-sans text-[10px] uppercase tracking-[0.2em] transition-colors font-bold ${isActive ? 'text-brand-primary' : 'hover:text-brand-primary text-white'}`}
              >
                {item}
              </a>
            );
          })}
          <a 
            href="#contacto"
            className="bg-brand-primary text-brand-dark px-6 py-2 rounded-full font-sans text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-colors"
          >
            Contacto
          </a>
        </div>

        <button 
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(true)}
        >
          <MenuIcon size={24} />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-dark z-[100] flex flex-col p-8"
          >
            <div className="flex justify-end">
              <button onClick={() => setIsMenuOpen(false)}>
                <X size={32} />
              </button>
            </div>
            <div className="flex flex-col gap-8 mt-12">
              {['Inicio', 'La Carta', 'Nosotros', 'Eventos', 'Localización'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-')}`}
                  className="font-display text-5xl uppercase"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
            <div className="mt-auto border-t border-zinc-800 pt-8 flex gap-6">
              <Instagram className="text-zinc-500" />
              <Phone className="text-zinc-500" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="inicio" className="relative h-screen flex items-center justify-center pt-20 overflow-hidden scroll-mt-20">
        {/* Abstract Industrial Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/20 via-brand-dark/80 to-brand-dark z-10" />
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
            src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Background"
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="container mx-auto px-6 relative z-20 text-center pb-24 md:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 border border-brand-primary text-brand-primary rounded-full font-sans text-xs uppercase tracking-[0.3em] mb-6">
              Est. en Asturias
            </span>
            <h1 className="font-display text-6xl md:text-[12rem] lg:text-[16rem] leading-[0.85] uppercase mb-4 tracking-tighter">
              LA <br />
              <span className="text-stroke">FÁBRICA</span>
            </h1>
            <p className="font-sans text-base md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-8 md:mb-12 font-light">
              Donde la tradición asturiana y el <span className="text-white font-medium">street food gourmet</span> se encuentran en cada bocado.
            </p>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center">
              <a 
                href="#la-carta"
                className="group relative px-10 md:px-12 py-4 md:py-5 bg-brand-primary text-brand-dark font-display text-xl md:text-2xl uppercase overflow-hidden flex justify-center items-center"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Ver la Carta <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </span>
                <motion.div 
                  initial={false}
                  whileHover={{ x: '100%' }}
                  className="absolute inset-0 bg-white -translate-x-full transition-transform duration-300" 
                />
              </a>
              <a 
                href="#localizacion"
                className="px-10 md:px-12 py-4 md:py-5 border border-white/20 hover:border-brand-primary transition-colors text-white font-display text-xl md:text-2xl uppercase text-center flex justify-center items-center"
              >
                Dónde Estamos
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats/Badges Section */}
      <section className="py-24 border-y border-zinc-900 bg-zinc-950/50">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {[
            { label: 'Ternera', val: '100% Astur', icon: <Utensils size={20} /> },
            { label: 'Ingredientes', val: 'KM 0 Local', icon: <MapPin size={20} /> },
            { label: 'Estilo', val: 'Gourmet', icon: <ChefHat size={20} /> },
            { label: 'Servicio', val: 'Food Truck', icon: <Truck size={20} /> },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group flex flex-col items-center gap-3 cursor-pointer"
            >
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center text-brand-primary bg-zinc-900 group-hover:bg-brand-primary group-hover:text-brand-dark group-hover:border-brand-primary transition-all duration-300"
              >
                {stat.icon}
              </motion.div>
              <p className="text-xs uppercase tracking-widest text-zinc-500 transition-colors group-hover:text-brand-primary">{stat.label}</p>
              <h3 className="font-display text-2xl uppercase">{stat.val}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Menu/Carta Section */}
      <section id="la-carta" className="py-32 bg-brand-dark scroll-mt-20">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8"
          >
            <div>
              <span className="font-serif italic text-brand-primary text-xl md:text-2xl mb-4 block">Delicia sobre ruedas</span>
              <h2 className="font-display text-5xl sm:text-6xl md:text-8xl uppercase leading-none break-words">LA CARTA DE<br/><span className="text-stroke tracking-tighter">LA FÁBRICA</span></h2>
            </div>
            
            <div className="flex flex-wrap gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-8 py-3 rounded-full text-xs uppercase tracking-widest font-bold transition-all whitespace-nowrap ${
                    activeCategory === cat 
                      ? 'bg-brand-primary text-brand-dark border-transparent shadow-[0_0_20px_rgba(245,158,11,0.3)]' 
                      : 'border border-zinc-800 text-zinc-400 hover:border-zinc-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            <AnimatePresence mode="wait">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="group flex flex-col h-full"
                >
                  <div className="glass-card rounded-[2rem] overflow-hidden border border-white/5 group-hover:border-brand-primary/50 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] group-hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer" onClick={() => setSelectedItem(item)}>
                    <div className="relative h-[250px] sm:h-64 lg:h-80 overflow-hidden shrink-0">
                      <div className="absolute inset-0 w-full h-full group-hover:scale-110 transition-transform duration-700">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          style={{ 
                            objectPosition: item.imagePosition || 'center',
                            transform: item.imageScale ? `scale(${item.imageScale})` : undefined
                          }}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      
                      {/* Dynamic Badges */}
                      {item.badges?.map((badge: string) => (
                        <div key={badge} className="absolute top-6 left-6 bg-brand-primary text-brand-dark font-display text-sm px-4 py-1 uppercase shadow-xl transform -rotate-2">
                          {badge}
                        </div>
                      ))}

                      <div className="absolute bottom-6 left-6 flex gap-2">
                        {item.tags.map(tag => (
                          <span key={tag} className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 bg-white/10 backdrop-blur text-white rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="font-display text-3xl uppercase mb-3 ">{item.name}</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-light flex-grow">
                        {item.description}
                      </p>
                      <button 
                        onClick={() => setSelectedItem(item)}
                        className="flex items-center gap-2 text-brand-primary text-xs uppercase tracking-[0.2em] font-bold group-hover:gap-4 transition-all"
                      >
                        Más Detalles <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <AnimatePresence>
          {selectedItem && (
            <Modal 
              item={selectedItem} 
              onClose={() => setSelectedItem(null)} 
            />
          )}
        </AnimatePresence>
      </section>

      {/* About Section */}
      <section id="nosotros" className="py-32 bg-zinc-950 overflow-hidden relative scroll-mt-20">
        {/* Decorative elements */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-primary/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-accent/5 blur-[120px] rounded-full" />

        <div className="container mx-auto px-6 grid md:grid-cols-2 items-center gap-16 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
             <div className="absolute -inset-4 border border-brand-primary/20 rounded-[3rem] -z-10" />
             <div className="rounded-[3rem] overflow-hidden aspect-[4/5] relative">
                <img 
                  src="/img/foodtruck.jpeg" 
                  alt="Food Truck de La Fábrica de Asturias" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
             </div>
             
             {/* Floating Testimonial Card */}
             <div className="relative lg:absolute w-full max-w-sm mx-auto mt-12 lg:mt-0 lg:-bottom-10 lg:-right-10 z-10 group">
               {/* Desktop Nav Arrows */}
               <button 
                 onClick={() => setCurrentTestimonial(prev => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                 className="hidden lg:flex absolute top-1/2 -left-6 lg:-left-12 -translate-y-1/2 w-10 h-10 bg-zinc-900 border border-white/10 rounded-full items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-primary hover:text-brand-dark z-20 shadow-xl"
               >
                 <ArrowRight className="rotate-180" size={18} />
               </button>
               <button 
                 onClick={() => setCurrentTestimonial(prev => (prev + 1) % TESTIMONIALS.length)}
                 className="hidden lg:flex absolute top-1/2 -right-6 lg:-right-12 -translate-y-1/2 w-10 h-10 bg-zinc-900 border border-white/10 rounded-full items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-primary hover:text-brand-dark z-20 shadow-xl"
               >
                 <ArrowRight size={18} />
               </button>

               <div className="overflow-hidden lg:overflow-visible">
                 <AnimatePresence mode="wait">
                   <motion.div 
                     key={currentTestimonial}
                     initial={{ x: 20, opacity: 0 }}
                     animate={{ x: 0, opacity: 1 }}
                     exit={{ x: -20, opacity: 0 }}
                     drag="x"
                     dragConstraints={{ left: 0, right: 0 }}
                     dragElastic={0.2}
                     onDragEnd={(e, { offset }) => {
                       if (offset.x < -50) {
                         setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
                       } else if (offset.x > 50) {
                         setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
                       }
                     }}
                     className="glass-card bg-zinc-950 p-8 rounded-3xl border border-white/10 shadow-2xl w-full cursor-grab active:cursor-grabbing"
                   >
                    <div className="flex gap-1 text-brand-primary mb-4">
                      {[...Array(TESTIMONIALS[currentTestimonial].rating)].map((_, s) => (
                        <Star key={s} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-sm italic text-zinc-300 mb-4 leading-relaxed">
                      {TESTIMONIALS[currentTestimonial].text}
                    </p>
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-[10px] font-bold text-brand-primary">
                          {TESTIMONIALS[currentTestimonial].name[0]}
                       </div>
                       <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">
                         {TESTIMONIALS[currentTestimonial].name}
                       </span>
                    </div>
                    
                    {/* Tiny Page Indicator */}
                    <div className="mt-4 flex gap-2 justify-center">
                       {TESTIMONIALS.map((_, idx) => (
                         <button 
                           key={idx}
                           onClick={() => setCurrentTestimonial(idx)}
                           className={`h-1.5 rounded-full transition-all ${
                             currentTestimonial === idx ? 'w-4 bg-brand-primary' : 'w-1.5 bg-white/20 hover:bg-white/40'
                           }`}
                         />
                       ))}
                    </div>
                 </motion.div>
               </AnimatePresence>
               </div>
             </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="font-display text-brand-primary text-xl md:text-2xl uppercase tracking-[0.2em] mb-4 block">Nuestra Historia</span>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl uppercase mb-8 leading-none">FORJANDO<br/>SABORES</h2>
            <div className="space-y-6 text-zinc-400 font-light leading-relaxed text-lg">
              <p>
                En <span className="text-white font-medium italic">La Fábrica de Asturias</span>, no solo cocinamos hamburguesas; forjamos experiencias. Nacimos de la pasión por la gastronomía asturiana y el deseo de llevarla a cada rincón sobre cuatro ruedas.
              </p>
              <p>
                Nuestra filosofía es simple: <span className="text-white font-medium">Producto local de máxima calidad</span>. Trabajamos directamente con ganaderos de la Tierrina y pequeñas queserías para que cada bocado te transporte a las montañas verdes del norte.
              </p>
              <p>
                Desde nuestros inicios en Gijón, hemos recorrido festivales y eventos por toda la península, siempre con la sidra fría y la plancha a punto.
              </p>
            </div>
            <div className="mt-12 flex flex-wrap gap-8">
               <div className="flex flex-col gap-1">
                  <span className="font-display text-4xl text-white tracking-widest">2021</span>
                  <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-zinc-500">Fundación</span>
               </div>
               <div className="flex flex-col gap-1">
                  <span className="font-display text-4xl text-white tracking-widest">+50</span>
                  <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-zinc-500">Festivales</span>
               </div>
               <div className="flex flex-col gap-1">
                  <span className="font-display text-4xl text-white tracking-widest">100k</span>
                  <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-zinc-500">Hamburguesas</span>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Events Section */}
      <section id="eventos" className="py-32 bg-zinc-950/70 border-t border-zinc-900 scroll-mt-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="font-serif italic text-brand-primary text-xl md:text-2xl mb-4 block">Próximos encuentros</span>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl uppercase leading-none">EVENTOS QUE<br/><span className="text-stroke tracking-tighter">NO TE PUEDES PERDER</span></h2>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <motion.article
                key={event.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="glass-card border-white/10 bg-zinc-950 p-8 rounded-[2rem] flex flex-col gap-5"
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-bold">{event.date}</p>
                  <h3 className="font-display text-3xl uppercase mt-3">{event.title}</h3>
                </div>
                <p className="text-zinc-400 font-light leading-relaxed">{event.description}</p>
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center gap-2 rounded-full border border-brand-primary/30 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-primary hover:bg-brand-primary hover:text-brand-dark transition-colors"
                >
                  Añadir a mi agenda <ArrowRight size={16} />
                </a>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Booking / Contact Section */}
      <section id="contacto" className="py-32 bg-brand-dark border-t border-zinc-900 scroll-mt-20">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto glass-card border-white/5 bg-zinc-950 text-white p-6 sm:p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 md:p-12 opacity-5 pointer-events-none text-brand-primary hidden sm:block">
               <Truck size={200} />
            </div>
            
            <div className="relative z-10 grid md:grid-cols-2 gap-12 lg:gap-16">
              <div>
                <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase leading-none mb-4 md:mb-6">EVENTOS &<br/><span className="text-brand-primary italic font-serif lowercase tracking-normal">catering</span></h2>
                <p className="text-zinc-400 font-light mb-12">
                  ¿Quieres que La Fábrica aparque en tu boda, cumpleaños o evento de empresa? Cuéntanos qué necesitas y nosotros ponemos el sabor.
                </p>
                <div className="space-y-6">
                  <a 
                    href="tel:+34685135192" 
                    className="flex items-center gap-4 group cursor-pointer"
                  >
                    <div className="w-12 h-12 shrink-0 rounded-full border border-zinc-800 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-brand-dark transition-colors">
                      <Phone size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-bold text-zinc-500">Llámanos</p>
                      <p className="text-xl group-hover:text-brand-primary transition-colors">+34 685 13 51 92</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 shrink-0 rounded-full border border-zinc-800 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-brand-dark transition-colors">
                      <Mail size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-bold text-zinc-500">Email</p>
                      <p className="text-base sm:text-lg break-all">sidreriaelembarcadero@hotmail.com</p>
                    </div>
                  </div>
                  <a 
                    href="https://www.instagram.com/lafabricadeasturias/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-4 group cursor-pointer"
                  >
                    <div className="w-12 h-12 shrink-0 rounded-full border border-zinc-800 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-brand-dark transition-colors">
                      <Instagram size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-bold text-zinc-500">Instagram</p>
                      <p className="text-xl group-hover:text-brand-primary transition-colors truncate">@lafabricadeasturias</p>
                    </div>
                  </a>
                </div>
              </div>

              <div>
                {formStatus === 'success' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center p-8 border border-brand-primary/30 rounded-3xl"
                  >
                    <div className="w-20 h-20 bg-brand-primary text-brand-dark rounded-full flex items-center justify-center mb-6">
                       <Send size={40} />
                    </div>
                    <h3 className="font-display text-3xl uppercase mb-2">Mensaje Enviado</h3>
                    <p className="text-zinc-400 text-sm">Gracias por contactar. Nos pondremos en contacto contigo en breve para preparar tu evento.</p>
                    <button 
                      onClick={() => setFormStatus('idle')}
                      className="mt-8 text-xs uppercase font-bold tracking-widest text-brand-primary hover:underline"
                    >
                      Enviar otro mensaje
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Nombre Completo</label>
                       <input 
                         required
                         type="text"
                         name="name"
                         value={formData.name}
                         onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                         className="w-full bg-zinc-900 border border-zinc-800 focus:border-brand-primary outline-none px-6 py-4 rounded-2xl transition-all"
                         placeholder="Ej. Pelayo García"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Email de contacto</label>
                       <input 
                         required
                         type="email"
                         name="email"
                         value={formData.email}
                         onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                         className="w-full bg-zinc-900 border border-zinc-800 focus:border-brand-primary outline-none px-6 py-4 rounded-2xl transition-all"
                         placeholder="tu@email.com"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">¿Qué evento celebras?</label>
                       <textarea 
                         required
                         rows={4}
                         name="details"
                         value={formData.details}
                         onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                         className="w-full bg-zinc-900 border border-zinc-800 focus:border-brand-primary outline-none px-6 py-4 rounded-2xl transition-all resize-none"
                         placeholder="Cuéntanos fecha, lugar y número de personas."
                       />
                    </div>
                    {formStatus === 'error' && (
                      <p className="text-sm text-red-400">{formError}</p>
                    )}
                    <button 
                      disabled={formStatus === 'sending'}
                      className="w-full bg-brand-primary text-brand-dark py-5 rounded-2xl font-display text-2xl uppercase hover:bg-white transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {formStatus === 'sending' ? 'Enviando...' : (
                        <>Enviar Solicitud <Send size={20} /></>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer & Map Section */}
      <footer id="localizacion" className="pt-32 pb-12 bg-zinc-950 scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mb-24 lg:mb-32">
             <div>
                <h2 className="font-display text-5xl uppercase mb-8">ENCUÉNTRANOS</h2>
                <div className="space-y-8">
                   <div className="flex gap-6">
                      <div className="text-brand-primary"><MapPin size={32} /></div>
                      <div>
                         <h4 className="font-display text-2xl uppercase mb-2">Ubicación Actual</h4>
                         <p className="text-zinc-400 font-light">Estamos rotando por Madrid. Síguenos en Instagram para saber nuestra parada de hoy.</p>
                         <p className="text-white mt-2">Móstoles, Madrid (Ubicación actual)</p>
                      </div>
                   </div>
                   <div className="flex gap-6">
                      <div className="text-brand-primary"><Clock size={32} /></div>
                      <div>
                         <h4 className="font-display text-2xl uppercase mb-2">Horarios de Fábrica</h4>
                         <p className="text-zinc-400 font-light">Jueves a Domingo: 13:00 - 16:00 | 20:00 - 23:30</p>
                      </div>
                   </div>
                   <div className="flex gap-6">
                      <div className="text-brand-primary"><Mail size={32} /></div>
                      <div>
                         <h4 className="font-display text-2xl uppercase mb-2">Colaboraciones</h4>
                         <p className="text-zinc-400 font-light">sidreriaelembarcadero@hotmail.com</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="h-[300px] sm:h-[400px] lg:h-[500px] rounded-[2rem] md:rounded-[3rem] overflow-hidden grayscale contrast-125 border border-zinc-800 relative group">
                {cookieConsent === 'accepted' ? (
                  <>
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12164.53102641025!2d-3.864!3d40.323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd418e6977712345%3A0x7d656096538c20!2sM%C3%B3stoles%2C%20Madrid!5e0!3m2!1sen!2ses!4v1700000000000!5m2!1sen!2ses" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    <div className="absolute inset-0 bg-brand-dark/20 pointer-events-none group-hover:bg-transparent transition-colors" />
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-4 bg-zinc-900/90 p-8 text-center">
                    <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-brand-primary">Mapa con cookies</p>
                    <h3 className="font-display text-3xl uppercase">Mapa de ubicación</h3>
                    <p className="max-w-sm text-sm text-zinc-400">Acepta las cookies de terceros para ver el mapa interactivo de Google Maps.</p>
                    {cookieConsent === 'pending' && (
                      <div className="flex flex-wrap justify-center gap-3">
                        <button onClick={() => setCookieConsent('rejected')} className="rounded-full border border-zinc-700 px-4 py-2 text-xs uppercase tracking-[0.2em] text-zinc-300">Rechazar</button>
                        <button onClick={() => setCookieConsent('accepted')} className="rounded-full bg-brand-primary px-4 py-2 text-xs uppercase tracking-[0.2em] text-brand-dark">Aceptar</button>
                      </div>
                    )}
                  </div>
                )}
             </div>
          </div>

          {cookieConsent === 'pending' && (
            <div className="mb-8 rounded-[1.5rem] border border-brand-primary/20 bg-zinc-900/80 p-4 sm:p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-zinc-300">Utilizamos cookies para mostrar el mapa y mejorar tu experiencia. Puedes elegir si aceptas o no las cookies de terceros.</p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setCookieConsent('rejected')} className="rounded-full border border-zinc-700 px-4 py-2 text-xs uppercase tracking-[0.2em] text-zinc-300">Rechazar</button>
                <button onClick={() => setCookieConsent('accepted')} className="rounded-full bg-brand-primary px-4 py-2 text-xs uppercase tracking-[0.2em] text-brand-dark">Aceptar</button>
              </div>
            </div>
          )}

          <div className="border-t border-zinc-900 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
             <div className="flex flex-col md:flex-row items-center gap-4">
                <img src={BRAND.logo} alt="Logo" className="w-8 h-8 invert grayscale opacity-50 mb-2 md:mb-0" referrerPolicy="no-referrer" />
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] sm:tracking-[0.4em] text-zinc-600">© {new Date().getFullYear()} {BRAND.name}. Fabricado con orgullo en Asturias.</p>
             </div>
             <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
                {[{label:'Términos', href:'/terminos.html'}, {label:'Privacidad', href:'/privacidad.html'}, {label:'Cookies', href:'/cookies.html'}].map(item => (
                  <a key={item.label} href={item.href} className="text-[10px] uppercase font-bold tracking-widest text-zinc-600 hover:text-white transition-colors">{item.label}</a>
                ))}
             </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/34685135192"
        target="_blank"
        rel="noopener noreferrer"
        title="¡Haz tu pedido o consúltanos!"
        className="fixed bottom-6 right-6 md:bottom-12 md:right-12 z-[100] w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center hover:bg-[#20bd5a] hover:scale-110 active:scale-95 transition-all shadow-xl hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] group"
      >
        <span className="absolute right-16 bg-zinc-900 border border-white/10 text-white text-xs px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 transition-all translate-x-2 pointer-events-none whitespace-nowrap font-medium font-sans">
          ¡Haz tu pedido!
        </span>
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.88-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
      </a>

    </div>
  );
}

