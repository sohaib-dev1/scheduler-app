import { createSlice, createEntityAdapter, EntityId } from "@reduxjs/toolkit"
import type { RootState } from "@/lib/store"

export interface Lead {
  id: string
  name: string
  company: string
  email: string
  phone: string
  source: string
  callDate: string
  callTime: string
  duration: string // Added duration field
  stage: "initial" | "technical" | "final" // Added stage field
  notes: string
  status: "scheduled" | "completed" | "cancelled" | "rescheduled"
  createdAt: string
}

const leadsAdapter = createEntityAdapter<Lead>({
  selectId: (lead: Lead) => lead.id,
  sortComparer: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
})

export const leadsSlice = createSlice({
  name: "leads",
  initialState: leadsAdapter.getInitialState({
    loading: false,
    error: null,
  }),
  reducers: {
    addLead: leadsAdapter.addOne,
    updateLead: leadsAdapter.updateOne,
    removeLead: leadsAdapter.removeOne,
    setLeads: leadsAdapter.setAll,
  },
})

export const { addLead, updateLead, removeLead, setLeads } = leadsSlice.actions

export const {
  selectAll: selectLeads,
  selectById: selectLeadById,
  selectIds: selectLeadIds,
} = leadsAdapter.getSelectors<RootState>((state) => state.leads)

export default leadsSlice.reducer
