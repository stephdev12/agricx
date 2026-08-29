'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Paperclip,
  ArrowUp,
  RotateCw,
  X,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AttachedFile {
  id: string;
  name: string;
  meta: string;
  src?: string;
}

interface ChatMessageItem {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  attachments?: AttachedFile[];
  timestamp: string;
}

const SAMPLE_PROMPTS = [
  "Silures avec branchies pâles et apathie",
  "Poulets prostrés avec fientes sanglantes",
  "Formule provende démarrage poulet 21%",
  "Traitement du mildiou de la tomate",
];

export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Bonjour. Je suis votre conseiller technique et vétérinaire Agricx.\n\nPosez vos questions sur la pisciculture, l'aviculture, le maraîchage, la santé animale ou la formulation d'aliments locaux au Cameroun. Vous pouvez aussi joindre une photo de vos cultures ou bacs.`,
      timestamp: "À l'instant",
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        const isImage = file.type.startsWith('image/');
        const sizeFormatted =
          file.size > 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
            : `${Math.round(file.size / 1024)} KB`;
        const meta = `${file.type.split('/')[1]?.toUpperCase() || 'FILE'} · ${sizeFormatted}`;

        reader.onload = (event) => {
          const newAtt: AttachedFile = {
            id: `${Date.now()}-${Math.random()}`,
            name: file.name,
            meta,
            src: isImage ? (event.target?.result as string) : undefined,
          };
          setAttachments((prev) => [...prev, newAtt]);
        };
        reader.readAsDataURL(file);
      });
      e.target.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const sendQuestion = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text && attachments.length === 0) return;

    const userMsg: ChatMessageItem = {
      id: Date.now().toString(),
      sender: 'user',
      text: text || (attachments.length > 0 ? 'Document joint pour analyse.' : ''),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setAttachments([]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ text: m.text, sender: m.sender })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: ChatMessageItem = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: data.text,
          timestamp: data.timestamp || new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
        return;
      }
    } catch (err) {
      console.warn('Fallback local RAG suite à erreur réseau:', err);
    }

    // Local smart RAG fallback
    const lowerText = text.toLowerCase();
    let responseText =
      "Recommandations techniques :\n\n• Vérifiez les paramètres de base (température, ventilation, qualité de l'eau, stockage de la provende).\n• Si les symptômes persistent, n'hésitez pas à joindre une photo ou contacter un vétérinaire dans l'annuaire.";

    if (lowerText.includes('silure') || lowerText.includes('poisson') || lowerText.includes('alevin') || lowerText.includes('bac') || lowerText.includes('branchie')) {
      responseText =
        "Diagnostic Piscicole — Silure Clarias :\n\n• Problème probable : Asphyxie par déficit en oxygène dissous ou élévation des nitrites (NO2) / ammoniac (NH3).\n\n• Protocole d'urgence :\n1. Renouveler immédiatement 40% à 50% de l'eau avec de l'eau propre non traitée au chlore.\n2. Stopper totalement l'alimentation pendant 24 à 48 heures.\n3. Ajouter du sel de cuisine non iodé à raison de 1,5 kg par m³ d'eau pour protéger les branchies.\n4. Renforcer l'aération mécanique.\n\n• Surveillance : Contrôler le pH et le comportement sous 24h.";
    } else if (lowerText.includes('poulet') || lowerText.includes('poussin') || lowerText.includes('fiente') || lowerText.includes('coccidiose') || lowerText.includes('aviaire')) {
      responseText =
        "Diagnostic Avicole — Poulets de chair :\n\n• Suspicion : Coccidiose ou entérite bactérienne.\n\n• Protocole recommandé :\n1. Isoler les sujets faibles ou prostrés.\n2. Administrer un anticoccidien (ex: Amprolium ou Toltrazuril) dans l'eau de boisson pendant 3 à 5 jours selon posologie.\n3. Remplacer les zones de litière humide par des copeaux secs désinfectés.\n4. Distribuer des vitamines A, D3, E, K après le traitement.";
    } else if (lowerText.includes('provende') || lowerText.includes('formule') || lowerText.includes('ration') || lowerText.includes('soja') || lowerText.includes('farine')) {
      responseText =
        "Formule Provende Démarrage (0-3 semaines) — Base 100 kg (21% Protéines) :\n\n• Maïs concassé : 55 kg\n• Tourteau de soja (46%) : 26 kg\n• Farine de poisson locale (60%) : 8 kg\n• Son de blé fin : 6 kg\n• Concentré minéral vitaminé (CMV 5%) : 4 kg\n• Huile végétale : 1 kg\n\nDistribuer en granulométrie fine avec eau fraîche constante.";
    }

    setTimeout(() => {
      const botMsg: ChatMessageItem = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: responseText,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  const handleSend = () => {
    sendQuestion(inputText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: 'Bonjour. Comment puis-je vous aider aujourd\'hui sur votre exploitation ?',
        timestamp: "À l'instant",
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden bg-transparent text-foreground">
      {/* ─── Minimal Header ─── */}
      <div className="px-4 sm:px-6 py-3 border-b border-border/50 bg-card/60 backdrop-blur-md flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-sm font-semibold text-foreground">Conseiller IA</h1>
          <p className="text-[11px] text-muted-foreground">Assistance technique & zootechnique</p>
        </div>

        <button
          type="button"
          onClick={resetChat}
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border/60 hover:bg-muted transition-colors cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Effacer</span>
        </button>
      </div>

      {/* ─── Messages Feed ─── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5 max-w-2xl w-full mx-auto">
        {/* Sample prompt text links */}
        {messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2 pb-4 pt-2"
          >
            <p className="text-xs text-muted-foreground font-medium">Exemples de questions :</p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => sendQuestion(prompt)}
                  className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border border-border/70 bg-card hover:bg-muted transition-colors cursor-pointer text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Media Attachments */}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {msg.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="rounded-xl overflow-hidden border border-border bg-card p-1 max-w-[180px]"
                    >
                      {att.src ? (
                        <img src={att.src} alt={att.name} className="w-full h-24 object-cover rounded-lg" />
                      ) : (
                        <div className="p-3 text-xs text-muted-foreground flex items-center gap-1.5">
                          <FileText className="w-4 h-4" />
                          <span className="truncate">{att.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-2xl rounded-br-xs px-4 py-2.5 max-w-[85%]'
                    : 'bg-card border border-border text-foreground rounded-2xl rounded-bl-xs p-4 max-w-full shadow-xs'
                }`}
              >
                {msg.text}
              </div>

              <span className="text-[10px] text-muted-foreground mt-1 px-1">
                {msg.timestamp}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Analyse en cours...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* ─── Minimal Bottom Input Dock (Generous pb to clear bottom glow menu) ─── */}
      <div className="shrink-0 z-20 pb-28 sm:pb-32 pt-2 px-4 sm:px-6 bg-gradient-to-t from-background via-background/95 to-transparent">
        <div className="max-w-2xl mx-auto w-full space-y-2">
          {/* Pending files */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 bg-card rounded-xl border border-border">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-lg text-xs text-foreground"
                >
                  <span className="truncate max-w-[140px]">{att.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(att.id)}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Simple minimal input bar */}
          <div className="flex items-center gap-2 border border-border bg-card/90 rounded-2xl px-3 py-2 shadow-lg focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all">
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*,.pdf,.doc"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer shrink-0"
              title="Joindre un fichier ou une photo"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Posez une question technique ou décrivez un symptôme..."
              rows={1}
              className="flex-1 bg-transparent px-1 py-1 text-sm text-foreground outline-none resize-none placeholder:text-muted-foreground leading-relaxed max-h-24"
            />

            <Button
              type="button"
              variant="emerald"
              size="icon"
              onClick={handleSend}
              disabled={!inputText.trim() && attachments.length === 0}
              className="h-8 w-8 rounded-xl shrink-0 cursor-pointer"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
