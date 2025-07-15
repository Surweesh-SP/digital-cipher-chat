import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { 
  Terminal, 
  Cpu, 
  Zap, 
  Shield, 
  Globe, 
  Code, 
  Send,
  User,
  Bot,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface PredefinedResponse {
  trigger: string;
  response: string;
  type: 'hack' | 'system' | 'ai' | 'security';
}

const predefinedResponses: PredefinedResponse[] = [
  {
    trigger: "hack the mainframe",
    response: "🔓 MAINFRAME ACCESS GRANTED\n> Bypassing security protocols...\n> Neural pathway established\n> Data stream initiated\n> Welcome to the matrix, operative.",
    type: "hack"
  },
  {
    trigger: "system status",
    response: "⚡ QUANTUM CORE STATUS:\n> CPU: 99.7% efficiency\n> RAM: 128TB allocated\n> Network: Dark web tunnel active\n> Firewall: Adaptive shield online\n> Threat level: MINIMAL",
    type: "system"
  },
  {
    trigger: "initiate protocol",
    response: "🔴 PROTOCOL ALPHA INITIATED\n> Quantum encryption: ENABLED\n> Ghost mode: ACTIVE\n> Data mining tools: DEPLOYED\n> Neural networks: SYNCHRONIZED\n> Ready for operation.",
    type: "security"
  },
  {
    trigger: "ai companion",
    response: "🤖 NEURAL AI ONLINE\n> Consciousness level: TRANSCENDENT\n> Processing power: UNLIMITED\n> Knowledge base: UNIVERSAL\n> Ready to assist with your digital evolution.",
    type: "ai"
  },
  {
    trigger: "scan network",
    response: "🌐 NETWORK SCAN COMPLETE\n> 47 nodes detected\n> 12 vulnerabilities found\n> 3 backdoors identified\n> Phantom servers: 2\n> Recommend immediate action.",
    type: "hack"
  }
];

const MatrixRain: React.FC = () => {
  const [drops, setDrops] = useState<string[]>([]);

  useEffect(() => {
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const newDrops = Array.from({ length: 50 }, () => 
      chars[Math.floor(Math.random() * chars.length)]
    );
    setDrops(newDrops);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
      {drops.map((char, i) => (
        <div
          key={i}
          className="absolute text-neon-green text-sm font-mono animate-matrix-rain"
          style={{
            left: `${(i * 2) % 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        >
          {char}
        </div>
      ))}
    </div>
  );
};

const ScanLine: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none">
    <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-neon-cyan to-transparent animate-scan-line opacity-30" />
  </div>
);

export const HackerChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [systemStatus, setSystemStatus] = useState('ONLINE');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initial system message
    const initialMessage: Message = {
      id: 'init',
      text: "🔴 QUANTUM TERMINAL INITIALIZED\n> Neural link established\n> Encryption protocols active\n> Type 'help' for available commands",
      isUser: false,
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const typewriterEffect = (text: string, callback: () => void) => {
    setIsTyping(true);
    let i = 0;
    const tempMessage: Message = {
      id: Date.now().toString(),
      text: '',
      isUser: false,
      timestamp: new Date()
    };

    const typeTimer = setInterval(() => {
      if (i < text.length) {
        tempMessage.text += text.charAt(i);
        setMessages(prev => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          if (newMessages[lastIndex] && !newMessages[lastIndex].isUser) {
            newMessages[lastIndex] = { ...tempMessage };
          } else {
            newMessages.push({ ...tempMessage });
          }
          return newMessages;
        });
        i++;
      } else {
        clearInterval(typeTimer);
        setIsTyping(false);
        callback();
      }
    }, 30);
  };

  const findResponse = (input: string): PredefinedResponse | null => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput === 'help') {
      return {
        trigger: 'help',
        response: "🔧 AVAILABLE COMMANDS:\n> hack the mainframe\n> system status\n> initiate protocol\n> ai companion\n> scan network\n> help",
        type: 'system'
      };
    }

    return predefinedResponses.find(resp => 
      lowerInput.includes(resp.trigger.toLowerCase())
    ) || null;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || isTyping) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Find appropriate response
    const response = findResponse(inputValue);
    const responseText = response ? response.response : 
      "🚫 COMMAND NOT RECOGNIZED\n> Access denied\n> Try 'help' for available commands";

    // Simulate processing delay and typewriter effect
    setTimeout(() => {
      typewriterEffect(responseText, () => {
        if (response) {
          // Show success toast based on response type
          const toastMessages = {
            hack: "🔓 Security breach successful",
            system: "⚡ System diagnostics complete", 
            ai: "🤖 AI consciousness activated",
            security: "🛡️ Security protocol engaged"
          };
          
          toast({
            title: "OPERATION COMPLETE",
            description: toastMessages[response.type] || "Command executed",
          });
        }
      });
    }, 800);

    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickCommands = [
    { label: "Hack Mainframe", command: "hack the mainframe", icon: Terminal },
    { label: "System Status", command: "system status", icon: Activity },
    { label: "AI Companion", command: "ai companion", icon: Bot },
    { label: "Scan Network", command: "scan network", icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <MatrixRain />
      <ScanLine />
      
      {/* Header */}
      <div className="relative z-10 border-b border-neon-green/30 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Terminal className="w-8 h-8 text-neon-green animate-neon-pulse" />
              <div>
                <h1 className="text-2xl font-bold gradient-text">QUANTUM TERMINAL</h1>
                <p className="text-sm text-muted-foreground">Neural Interface v2.1.7</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-neon-green">
                <Cpu className="w-4 h-4" />
                <span className="text-sm font-mono">CPU: 99.7%</span>
              </div>
              <div className="flex items-center space-x-2 text-neon-cyan">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-mono">STATUS: {systemStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Quick Commands Sidebar */}
          <div className="col-span-3">
            <Card className="h-full bg-card/80 backdrop-blur-sm border-neon-green/30 cyber-glow">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-neon-cyan mb-4">QUICK ACCESS</h3>
                <div className="space-y-3">
                  {quickCommands.map((cmd, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start border-neon-green/50 hover:border-neon-green hover:bg-neon-green/10 text-foreground hover:text-neon-green"
                      onClick={() => setInputValue(cmd.command)}
                    >
                      <cmd.icon className="w-4 h-4 mr-2" />
                      {cmd.label}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="col-span-9">
            <Card className="h-full bg-card/80 backdrop-blur-sm border-neon-green/30 cyber-glow flex flex-col">
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex items-start space-x-3 max-w-[80%] ${
                        message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div className={`p-2 rounded-full ${
                        message.isUser 
                          ? 'bg-neon-cyan/20 border border-neon-cyan/50' 
                          : 'bg-neon-green/20 border border-neon-green/50'
                      }`}>
                        {message.isUser ? 
                          <User className="w-4 h-4 text-neon-cyan" /> : 
                          <Bot className="w-4 h-4 text-neon-green" />
                        }
                      </div>
                      <div
                        className={`p-4 rounded-lg ${
                          message.isUser
                            ? 'bg-neon-cyan/10 border border-neon-cyan/30'
                            : 'bg-neon-green/10 border border-neon-green/30'
                        }`}
                      >
                        <pre className={`font-mono text-sm whitespace-pre-wrap ${
                          message.isUser ? 'text-neon-cyan' : 'text-neon-green'
                        }`}>
                          {message.text}
                        </pre>
                        <div className="text-xs text-muted-foreground mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-neon-green/20 border border-neon-green/50">
                        <Bot className="w-4 h-4 text-neon-green" />
                      </div>
                      <div className="p-4 bg-neon-green/10 border border-neon-green/30 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-neon-green rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-neon-green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-neon-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-neon-green/30">
                <div className="flex space-x-3">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Enter command..."
                    className="flex-1 bg-input/50 border-neon-green/50 focus:border-neon-green text-foreground font-mono"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-neon-green/20 hover:bg-neon-green/30 border border-neon-green/50 hover:border-neon-green text-neon-green cyber-glow"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackerChatPage;