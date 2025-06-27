import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { militaryEncryption, messageExpirationManager, EncryptedMessage, MessageOptions } from "@/lib/encryption";
import { apiRequest } from "@/lib/queryClient";
import { Shield, Lock, Timer, AlertTriangle, CheckCircle, Send, Key, Eye, EyeOff } from "lucide-react";

interface SecureMessage {
  id: string;
  content: string;
  timestamp: number;
  expiresAt?: number;
  isExpired: boolean;
  isSelfDestructing: boolean;
  timeLeft?: string;
}

export default function SecureMessaging() {
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);
  const [userKeys, setUserKeys] = useState<{publicKey: string, privateKey: string} | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [messages, setMessages] = useState<SecureMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [selfDestruct, setSelfDestruct] = useState(false);
  const [expirationMinutes, setExpirationMinutes] = useState<number>(60);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize encryption system
  useEffect(() => {
    const initializeEncryption = async () => {
      try {
        const keys = await militaryEncryption.initialize();
        setUserKeys(keys);
        
        // Register user's public key with server
        const response = await apiRequest("POST", "/api/secure-messaging/register-key", {
          publicKey: keys.publicKey
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserId(data.userId);
          setIsInitialized(true);
          
          toast({
            title: "Secure Communication Ready",
            description: "End-to-end encryption initialized successfully",
          });
        }
      } catch (error) {
        console.error("Encryption initialization failed:", error);
        toast({
          title: "Encryption Failed",
          description: "Unable to initialize secure communication",
          variant: "destructive",
        });
      }
    };

    initializeEncryption();
  }, [toast]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update message timers
  useEffect(() => {
    const updateTimers = () => {
      const now = Date.now();
      setMessages(prev => prev.map(msg => {
        if (msg.expiresAt && msg.expiresAt > now) {
          const timeLeft = Math.ceil((msg.expiresAt - now) / 1000);
          const minutes = Math.floor(timeLeft / 60);
          const seconds = timeLeft % 60;
          return {
            ...msg,
            timeLeft: `${minutes}:${seconds.toString().padStart(2, '0')}`,
            isExpired: false
          };
        } else if (msg.expiresAt && msg.expiresAt <= now) {
          return { ...msg, isExpired: true, content: "[Message Self-Destructed]" };
        }
        return msg;
      }));
    };

    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, []);

  const sendSecureMessage = async () => {
    if (!newMessage.trim() || !recipientId.trim() || !isInitialized) return;

    setIsEncrypting(true);
    try {
      // Get recipient's public key
      const recipientResponse = await apiRequest("GET", `/api/secure-messaging/user-key/${recipientId}`);
      if (!recipientResponse.ok) {
        throw new Error("Recipient not found");
      }
      
      const { publicKey: recipientPublicKey } = await recipientResponse.json();

      // Encrypt message
      const messageOptions: MessageOptions = {
        selfDestruct,
        expirationMinutes: selfDestruct ? expirationMinutes : undefined
      };

      const encryptedMessage = await militaryEncryption.encryptMessage(
        newMessage,
        recipientPublicKey,
        messageOptions
      );

      // Send to server
      const sendResponse = await apiRequest("POST", "/api/secure-messaging/send", {
        encryptedPayload: JSON.stringify(encryptedMessage),
        ephemeralKey: encryptedMessage.ephemeralPublicKey,
        recipientId,
        expirationMinutes: messageOptions.expirationMinutes
      });

      if (sendResponse.ok) {
        const messageData: SecureMessage = {
          id: encryptedMessage.messageId,
          content: newMessage,
          timestamp: Date.now(),
          expiresAt: encryptedMessage.expiresAt,
          isExpired: false,
          isSelfDestructing: selfDestruct
        };

        setMessages(prev => [...prev, messageData]);

        // Schedule self-destruction if enabled
        if (selfDestruct && encryptedMessage.expiresAt) {
          const expirationMs = encryptedMessage.expiresAt - Date.now();
          messageExpirationManager.scheduleDestruction(
            encryptedMessage.messageId,
            expirationMs,
            () => {
              setMessages(prev => prev.map(msg => 
                msg.id === encryptedMessage.messageId 
                  ? { ...msg, isExpired: true, content: "[Message Self-Destructed]" }
                  : msg
              ));
            }
          );
        }

        setNewMessage("");
        toast({
          title: "Message Sent Securely",
          description: selfDestruct 
            ? `Message will self-destruct in ${expirationMinutes} minutes`
            : "Message sent with end-to-end encryption",
        });
      }
    } catch (error) {
      console.error("Send message error:", error);
      toast({
        title: "Send Failed",
        description: "Unable to send secure message",
        variant: "destructive",
      });
    } finally {
      setIsEncrypting(false);
    }
  };

  const copyUserId = () => {
    navigator.clipboard.writeText(userId);
    toast({
      title: "User ID Copied",
      description: "Share this ID for secure communication",
    });
  };

  const copyPublicKey = () => {
    if (userKeys) {
      navigator.clipboard.writeText(userKeys.publicKey);
      toast({
        title: "Public Key Copied",
        description: "Public key copied to clipboard",
      });
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-blue-200/20 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-slate-800">Initializing Secure Communication</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-slate-600">Setting up military-grade encryption...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-blue-200/20 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-slate-800">Secure Military Communications</CardTitle>
                <p className="text-slate-600">Signal-like privacy with end-to-end encryption</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Lock className="h-3 w-3 mr-1" />
                  E2EE Active
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Encryption Keys Panel */}
          <Card className="border-blue-200/20 bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Key className="h-5 w-5" />
                Your Encryption Keys
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">User ID (Share for communication)</label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={userId}
                    readOnly
                    className="bg-slate-50 text-xs font-mono"
                  />
                  <Button onClick={copyUserId} size="sm" variant="outline">
                    Copy
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Public Key</label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={userKeys?.publicKey.slice(0, 20) + "..."}
                    readOnly
                    className="bg-slate-50 text-xs font-mono"
                  />
                  <Button onClick={copyPublicKey} size="sm" variant="outline">
                    Copy
                  </Button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">Private Key</label>
                  <Button
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    size="sm"
                    variant="ghost"
                  >
                    {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <Input
                  value={showPrivateKey ? userKeys?.privateKey : "•••••••••••••••••••••••••••••••••••••••••••••••••••"}
                  readOnly
                  type={showPrivateKey ? "text" : "password"}
                  className="bg-slate-50 text-xs font-mono mt-1"
                />
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Never share your private key
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Message Composer */}
          <Card className="border-blue-200/20 bg-white/95 backdrop-blur-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Send className="h-5 w-5" />
                Send Secure Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Recipient User ID</label>
                <Input
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  placeholder="Enter recipient's user ID..."
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Message</label>
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your secure message here..."
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="self-destruct"
                    checked={selfDestruct}
                    onChange={(e) => setSelfDestruct(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="self-destruct" className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    <Timer className="h-4 w-4" />
                    Self-destruct message
                  </label>
                </div>

                {selfDestruct && (
                  <Select value={expirationMinutes.toString()} onValueChange={(value) => setExpirationMinutes(parseInt(value))}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 minute</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="1440">24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <Button
                onClick={sendSecureMessage}
                disabled={!newMessage.trim() || !recipientId.trim() || isEncrypting}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isEncrypting ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Encrypting Message...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Secure Message
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Messages */}
        <Card className="border-blue-200/20 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lock className="h-5 w-5" />
              Sent Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No messages sent yet</p>
                  <p className="text-sm">Your secure communications will appear here</p>
                </div>
              ) : (
                messages.map((message) => (
                  <Card
                    key={message.id}
                    className={`border-l-4 ${
                      message.isExpired 
                        ? "border-l-red-500 bg-red-50" 
                        : message.isSelfDestructing 
                          ? "border-l-amber-500 bg-amber-50" 
                          : "border-l-green-500 bg-green-50"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`${message.isExpired ? "text-red-600 italic" : "text-slate-800"}`}>
                            {message.content}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                            <span>{new Date(message.timestamp).toLocaleString()}</span>
                            {message.isSelfDestructing && !message.isExpired && (
                              <>
                                <Timer className="h-3 w-3" />
                                <span className="text-amber-600 font-medium">
                                  Self-destructs in {message.timeLeft}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {message.isExpired ? (
                            <Badge variant="destructive" className="text-xs">
                              Expired
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Encrypted
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="border-blue-200/20 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3 text-sm text-slate-600">
              <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-800 mb-1">Privacy & Security Features</p>
                <ul className="space-y-1">
                  <li>• End-to-end encryption using military-grade cryptography</li>
                  <li>• Forward secrecy with ephemeral keys for each message</li>
                  <li>• Self-destructing messages for sensitive communications</li>
                  <li>• Minimal metadata storage - no IP addresses or timestamps logged</li>
                  <li>• Messages automatically deleted from server after delivery</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}