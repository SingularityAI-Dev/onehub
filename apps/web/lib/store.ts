import { create } from 'zustand'

export type AgentStatus = "idle" | "listening" | "thinking" | "speaking";

export interface Message {
  id: string;
  sender: "user" | "aura";
  text: string;
}

interface ConversationState {
  isModalOpen: boolean;
  agentStatus: AgentStatus;
  transcript: Message[];
  openModal: () => void;
  closeModal: () => void;
  setAgentStatus: (status: AgentStatus) => void;
  addMessage: (message: Message) => void;
  clearTranscript: () => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  isModalOpen: false,
  agentStatus: "idle",
  transcript: [],
  openModal: () => set({ isModalOpen: true, agentStatus: "idle", transcript: [] }),
  closeModal: () => set({ isModalOpen: false }),
  setAgentStatus: (status) => set({ agentStatus: status }),
  addMessage: (message) => set((state) => ({ transcript: [...state.transcript, message] })),
  clearTranscript: () => set({ transcript: [] }),
}))
