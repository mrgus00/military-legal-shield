import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PremiumGate from "@/components/premium-gate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Send, Lock, Shield, Clock, User, UserCheck } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Conversation, Message } from "@shared/schema";

interface ConversationWithDetails extends Conversation {
  attorneyName?: string;
  userName?: string;
  unreadCount?: number;
}

interface MessageWithSender extends Message {
  senderName?: string;
}

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [newConversationOpen, setNewConversationOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // For demo purposes, simulating a user
  const currentUserId = 1;
  const userType = "user"; // In production, this would come from auth context
  const userTier = "premium"; // For demo, showing premium features

  // Fetch conversations
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery<ConversationWithDetails[]>({
    queryKey: ["/api/conversations", { userId: currentUserId, userType }],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/conversations?userId=${currentUserId}&userType=${userType}`);
      return response.json();
    },
    enabled: userTier === "premium"
  });

  // Fetch messages for selected conversation
  const { data: messages = [], isLoading: messagesLoading } = useQuery<MessageWithSender[]>({
    queryKey: ["/api/conversations", selectedConversation, "messages"],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/conversations/${selectedConversation}/messages`);
      return response.json();
    },
    enabled: !!selectedConversation && userTier === "premium"
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { content: string; senderId: number; senderType: string }) => {
      const response = await apiRequest("POST", `/api/conversations/${selectedConversation}/messages`, messageData);
      return response.json();
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", selectedConversation, "messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      toast({
        title: "Message sent",
        description: "Your message has been sent securely."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    sendMessageMutation.mutate({
      content: newMessage,
      senderId: currentUserId,
      senderType: userType
    });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-900 via-red-800 to-red-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 rounded-full">
              <MessageSquare className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Secure Messaging
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Communicate securely with your legal team. All messages are encrypted end-to-end for maximum privacy and protection.
          </p>
          <div className="flex justify-center items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Attorney-Client Privileged</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>24/7 Secure Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Messaging Interface */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PremiumGate
            feature="Secure Messaging"
            description="Direct encrypted communication with your attorneys, file sharing, and message history."
            userTier={userTier}
          >
            <div className="bg-white rounded-lg border shadow-sm h-[600px] flex">
              {/* Conversations Sidebar */}
              <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Conversations</h3>
                    <Button 
                      size="sm" 
                      onClick={() => setNewConversationOpen(true)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      New Chat
                    </Button>
                  </div>
                </div>
                
                <ScrollArea className="flex-1">
                  {conversationsLoading ? (
                    <div className="p-4 text-center text-gray-500">
                      Loading conversations...
                    </div>
                  ) : conversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No conversations yet</p>
                      <p className="text-sm">Start a new conversation with an attorney</p>
                    </div>
                  ) : (
                    <div className="p-2">
                      {conversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          className={`p-3 rounded-lg cursor-pointer mb-2 transition-colors ${
                            selectedConversation === conversation.id
                              ? "bg-red-50 border border-red-200"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => setSelectedConversation(conversation.id)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-sm truncate">
                              {conversation.subject || "Legal Consultation"}
                            </h4>
                            {conversation.unreadCount && conversation.unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <User className="h-3 w-3" />
                            <span>{conversation.attorneyName || "Attorney Name"}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatDate(conversation.lastMessageAt?.toString() || conversation.createdAt?.toString() || new Date().toISOString())}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {conversations.find(c => c.id === selectedConversation)?.subject || "Legal Consultation"}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <UserCheck className="h-4 w-4" />
                            <span>Attorney: {conversations.find(c => c.id === selectedConversation)?.attorneyName || "Sarah Mitchell"}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-green-600">
                          <Lock className="h-3 w-3" />
                          <span>Encrypted</span>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                      {messagesLoading ? (
                        <div className="flex justify-center items-center h-full">
                          <div className="text-gray-500">Loading messages...</div>
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="flex justify-center items-center h-full">
                          <div className="text-center text-gray-500">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No messages yet</p>
                            <p className="text-sm">Start the conversation below</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {messages.map((message, index) => (
                            <div
                              key={message.id}
                              className={`flex ${
                                message.senderType === userType ? "justify-end" : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  message.senderType === userType
                                    ? "bg-red-600 text-white"
                                    : "bg-gray-100 text-gray-900"
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <div className={`text-xs mt-1 ${
                                  message.senderType === userType ? "text-red-100" : "text-gray-500"
                                }`}>
                                  {formatTime(message.sentAt?.toString() || new Date().toISOString())}
                                  {message.isRead && message.senderType === userType && (
                                    <span className="ml-2">✓</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Type your secure message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="flex-1 min-h-[60px] resize-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || sendMessageMutation.isPending}
                          className="bg-red-600 hover:bg-red-700 px-4"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Messages are encrypted and protected by attorney-client privilege
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                      <p>Choose a conversation from the sidebar to start messaging</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </PremiumGate>
        </div>
      </section>

      <Footer />
    </div>
  );
}