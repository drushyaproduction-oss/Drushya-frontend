import React, { useState } from 'react';
import { FiImage, FiCheck, FiTrash2, FiPlus, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { getImageUrl } from '../../../../config';

const BasicInfoTab = ({ modalMode, formData, setFormData, categories, services, handleInputChange, handleThumbnailChange }) => {
  const [newFeature, setNewFeature] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  
  // Itinerary specific state
  const [newPhaseTitle, setNewPhaseTitle] = useState('');
  const [newItemTexts, setNewItemTexts] = useState({}); // { phaseIndex: text }
  const [expandedPhases, setExpandedPhases] = useState({}); // { phaseIndex: boolean }

  const getCategoryName = (catId) => {
    const cat = categories.find(c => c._id === catId);
    return cat ? cat.name : 'Unknown';
  };

  const getServiceName = (srvId) => {
    const srv = services.find(s => s._id === srvId);
    return srv ? srv.name : 'Unknown';
  };

  const availableServices = services.filter(s => s.categoryId === formData.categoryId);

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({ ...prev, features: [...(prev.features || []), newFeature.trim()] }));
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      setFormData(prev => ({ ...prev, benefits: [...(prev.benefits || []), newBenefit.trim()] }));
      setNewBenefit('');
    }
  };

  const removeBenefit = (index) => {
    setFormData(prev => ({ ...prev, benefits: prev.benefits.filter((_, i) => i !== index) }));
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({ ...prev, requirements: [...(prev.requirements || []), newRequirement.trim()] }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (index) => {
    setFormData(prev => ({ ...prev, requirements: prev.requirements.filter((_, i) => i !== index) }));
  };

  // Itinerary Handlers
  const handleAddPhase = () => {
    if (newPhaseTitle.trim()) {
      setFormData(prev => ({
        ...prev,
        itinerary: [...(prev.itinerary || []), { phase: newPhaseTitle.trim(), items: [] }]
      }));
      setNewPhaseTitle('');
    }
  };

  const removePhase = (index) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index)
    }));
  };

  const handleAddPhaseItem = (phaseIndex) => {
    const text = newItemTexts[phaseIndex];
    if (text && text.trim()) {
      setFormData(prev => {
        const newItin = [...(prev.itinerary || [])];
        newItin[phaseIndex] = {
          ...newItin[phaseIndex],
          items: [...(newItin[phaseIndex].items || []), text.trim()]
        };
        return { ...prev, itinerary: newItin };
      });
      setNewItemTexts(prev => ({ ...prev, [phaseIndex]: '' }));
    }
  };

  const removePhaseItem = (phaseIndex, itemIndex) => {
    setFormData(prev => {
      const newItin = [...prev.itinerary];
      newItin[phaseIndex].items = newItin[phaseIndex].items.filter((_, i) => i !== itemIndex);
      return { ...prev, itinerary: newItin };
    });
  };

  const togglePhase = (idx) => {
    setExpandedPhases(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (modalMode === 'view') {
    return (
      <div className="space-y-6">
        <div className="h-48 w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
          {formData.coverImage || formData.thumbnail ? (
            <img src={formData.thumbnail || getImageUrl(formData.coverImage)} alt={formData.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <FiImage size={40} />
            </div>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Package Title</p>
          <p className="text-lg font-bold text-gray-900 mt-1">{formData.title}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 font-medium">Category</p>
            <p className="text-md text-gray-800 mt-1">{getCategoryName(formData.categoryId)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Service</p>
            <p className="text-md text-gray-800 mt-1">{getServiceName(formData.serviceId)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 font-medium">Price</p>
            <p className="text-lg font-bold text-gray-900 mt-1">₹{formData.price}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Status</p>
            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-bold ${formData.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
              {formData.status}
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Description</p>
          <p className="text-md text-gray-800 mt-1 whitespace-pre-line">{formData.description}</p>
        </div>
        
        {/* WHAT'S INCLUDED (Features) */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <p className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">WHAT'S INCLUDED</p>
          <ul className="space-y-3">
            {formData.features?.map((feat, idx) => (
              <li key={idx} className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                <div className="w-5 h-5 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
                  <FiCheck className="text-yellow-500" size={14} />
                </div>
                <span>{feat}</span>
              </li>
            ))}
            {(!formData.features || formData.features.length === 0) && <p className="text-sm text-gray-400">No features added.</p>}
          </ul>
        </div>

        {/* Our Package Benefits */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <p className="text-lg font-bold text-gray-900 mb-4">Our Package Benefits</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {formData.benefits?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                <FiCheck className="text-yellow-500 shrink-0" size={16} />
                <span>{item}</span>
              </div>
            ))}
            {(!formData.benefits || formData.benefits.length === 0) && <p className="text-sm text-gray-400">No benefits added.</p>}
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white border border-blue-400 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-bold text-gray-900">Requirements</p>
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
              <FiCheck size={14} />
            </div>
          </div>
          <ul className="space-y-3">
            {formData.requirements?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
            {(!formData.requirements || formData.requirements.length === 0) && <p className="text-sm text-gray-400">No requirements added.</p>}
          </ul>
        </div>

        {/* The Itinerary */}
        <div className="space-y-4">
          <p className="text-lg font-bold text-gray-900">The Itinerary</p>
          {formData.itinerary?.map((phaseObj, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              <button 
                onClick={() => togglePhase(idx)}
                className="w-full flex justify-between items-center p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-gray-900">{phaseObj.phase}</span>
                {expandedPhases[idx] ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
              </button>
              {expandedPhases[idx] && (
                <div className="p-4 border-t border-gray-100">
                  <ul className="space-y-3">
                    {phaseObj.items?.map((item, iIdx) => (
                      <li key={iIdx} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                    {(!phaseObj.items || phaseObj.items.length === 0) && <p className="text-sm text-gray-400 italic">No items in this phase.</p>}
                  </ul>
                </div>
              )}
            </div>
          ))}
          {(!formData.itinerary || formData.itinerary.length === 0) && <p className="text-sm text-gray-400">No itinerary added.</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">


      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Package Title</label>
        <input 
          type="text" 
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="e.g. Gold Wedding Package" 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-400"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <div className="relative">
            <select 
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent cursor-pointer bg-white appearance-none ${formData.categoryId ? 'text-gray-900' : 'text-gray-400'}`}
            >
              <option value="" disabled>Select Category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Service</label>
          <div className="relative">
            <select 
              name="serviceId"
              value={formData.serviceId}
              onChange={handleInputChange}
              disabled={!formData.categoryId}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent cursor-pointer bg-white appearance-none ${formData.serviceId ? 'text-gray-900' : 'text-gray-400'} disabled:bg-gray-100 disabled:cursor-not-allowed`}
            >
              <option value="" disabled>Select Service</option>
              {availableServices.map(srv => (
                <option key={srv._id} value={srv._id}>{srv.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Price (₹)</label>
          <input 
            type="number" 
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="e.g. 1500" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-400"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <div className="relative">
            <select 
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent cursor-pointer bg-white appearance-none ${formData.status ? 'text-gray-900' : 'text-gray-400'}`}
            >
              <option value="" disabled>Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea 
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3} 
          placeholder="Enter package description..." 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
        />
      </div>

      {/* Editor for WHAT'S INCLUDED (Features) */}
      <div className="flex flex-col gap-2 border border-gray-200 p-4 rounded-xl bg-gray-50/30">
        <label className="text-sm font-bold text-gray-900 uppercase">What's Included</label>
        <div className="flex gap-2 mt-2">
          <input 
            type="text" 
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
            placeholder="e.g. 40 High-Res Edited Photos" 
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-400"
          />
          <button 
            onClick={(e) => { e.preventDefault(); handleAddFeature(); }}
            className="px-4 py-2 bg-yellow-50 text-yellow-600 font-medium rounded-lg hover:bg-yellow-100 transition-colors border border-yellow-200 whitespace-nowrap cursor-pointer"
          >
            Add
          </button>
        </div>
        <div className="flex flex-col gap-2 mt-3">
          {formData.features?.map((feat, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 pl-2 text-sm text-gray-700 font-medium">
                <div className="w-5 h-5 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
                  <FiCheck className="text-yellow-500" size={14} />
                </div>
                {feat}
              </div>
              <button 
                onClick={(e) => { e.preventDefault(); removeFeature(idx); }}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 cursor-pointer"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Editor for Our Package Benefits */}
      <div className="flex flex-col gap-2 border border-gray-200 p-4 rounded-xl bg-gray-50/30">
        <label className="text-sm font-bold text-gray-900">Our Package Benefits</label>
        <div className="flex gap-2 mt-2">
          <input 
            type="text" 
            value={newBenefit}
            onChange={(e) => setNewBenefit(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBenefit())}
            placeholder="e.g. High-Resolution Images" 
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-400"
          />
          <button 
            onClick={(e) => { e.preventDefault(); handleAddBenefit(); }}
            className="px-4 py-2 bg-yellow-50 text-yellow-600 font-medium rounded-lg hover:bg-yellow-100 transition-colors border border-yellow-200 whitespace-nowrap cursor-pointer"
          >
            Add
          </button>
        </div>
        <div className="flex flex-col gap-2 mt-3">
          {formData.benefits?.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 pl-2 text-sm text-gray-700 font-medium">
                <FiCheck className="text-yellow-500 shrink-0" size={16} />
                {item}
              </div>
              <button 
                onClick={(e) => { e.preventDefault(); removeBenefit(idx); }}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 cursor-pointer"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Editor for Requirements */}
      <div className="flex flex-col gap-2 border border-gray-200 p-4 rounded-xl bg-gray-50/30">
        <label className="text-sm font-bold text-gray-900">Requirements</label>
        <div className="flex gap-2 mt-2">
          <input 
            type="text" 
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
            placeholder="e.g. Booking at least 2 weeks in advance" 
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-400"
          />
          <button 
            onClick={(e) => { e.preventDefault(); handleAddRequirement(); }}
            className="px-4 py-2 bg-yellow-50 text-yellow-600 font-medium rounded-lg hover:bg-yellow-100 transition-colors border border-yellow-200 whitespace-nowrap cursor-pointer"
          >
            Add
          </button>
        </div>
        <div className="flex flex-col gap-2 mt-3">
          {formData.requirements?.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-blue-200 shadow-sm">
              <div className="flex items-center gap-3 pl-2 text-sm text-gray-700 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                {item}
              </div>
              <button 
                onClick={(e) => { e.preventDefault(); removeRequirement(idx); }}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 cursor-pointer"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Editor for The Itinerary (Nested) */}
      <div className="flex flex-col gap-2 border border-gray-200 p-4 rounded-xl bg-gray-50/30">
        <label className="text-sm font-bold text-gray-900">The Itinerary</label>
        
        {/* Add New Phase */}
        <div className="flex gap-2 mt-2">
          <input 
            type="text" 
            value={newPhaseTitle}
            onChange={(e) => setNewPhaseTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPhase())}
            placeholder="e.g. Phase 1: Pre-shoot Consultation" 
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-400"
          />
          <button 
            onClick={(e) => { e.preventDefault(); handleAddPhase(); }}
            className="px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            Add Phase
          </button>
        </div>

        {/* List of Phases */}
        <div className="flex flex-col gap-4 mt-4">
          {formData.itinerary?.map((phaseObj, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="flex justify-between items-center bg-gray-50 p-3 border-b border-gray-200">
                <span className="font-bold text-gray-900 text-sm">{phaseObj.phase}</span>
                <button 
                  onClick={(e) => { e.preventDefault(); removePhase(idx); }}
                  className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors cursor-pointer"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
              <div className="p-4 bg-white">
                {/* Add item to phase */}
                <div className="flex gap-2 mb-3">
                  <input 
                    type="text" 
                    value={newItemTexts[idx] || ''}
                    onChange={(e) => setNewItemTexts({ ...newItemTexts, [idx]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPhaseItem(idx))}
                    placeholder="Add an item to this phase..." 
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900"
                  />
                  <button 
                    onClick={(e) => { e.preventDefault(); handleAddPhaseItem(idx); }}
                    className="px-3 py-1.5 bg-yellow-50 text-yellow-600 text-sm font-medium rounded-lg hover:bg-yellow-100 transition-colors border border-yellow-200 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                
                {/* Phase Items List */}
                <ul className="space-y-2">
                  {phaseObj.items?.map((item, iIdx) => (
                    <li key={iIdx} className="flex items-start justify-between gap-3 text-sm text-gray-600 bg-gray-50/50 p-2 rounded-lg border border-gray-100 group">
                      <div className="flex items-start gap-2 pt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </div>
                      <button 
                        onClick={(e) => { e.preventDefault(); removePhaseItem(idx, iIdx); }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-all cursor-pointer shrink-0"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </li>
                  ))}
                  {(!phaseObj.items || phaseObj.items.length === 0) && <p className="text-xs text-gray-400 italic">No items yet.</p>}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BasicInfoTab;
