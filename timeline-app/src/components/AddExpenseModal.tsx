import React, { useState, useRef } from 'react';
import { PlusCircle, X, DollarSign, Heart, Camera, Image as ImageIcon, Trash2, Loader2 } from 'lucide-react';
import type { TimelineEvent, ExpenseCategory, MomentTag } from '../types';
import { CATEGORY_CONFIG, MOMENT_TAG_CONFIG } from '../types';
import { uploadMultipleAttachments } from '../lib/storageService';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (event: Omit<TimelineEvent, 'id'>) => void;
}

interface LocalFileItem {
  id: string;
  file: File;
  previewUrl: string;
}

export const AddExpenseModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [eventType, setEventType] = useState<'financial' | 'moment'>('financial');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  
  // Lista de múltiplos arquivos selecionados
  const [selectedFiles, setSelectedFiles] = useState<LocalFileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Campos específicos de financeiro
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('pensao');
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'Cartão' | 'Boleto' | 'Transferência' | 'Dinheiro'>('PIX');
  const [isEssential, setIsEssential] = useState(true);

  // Campos específicos de momento
  const [momentTag, setMomentTag] = useState<MomentTag>('afeto');
  const [emotion, setEmotion] = useState<'orgulho' | 'alegria' | 'amor' | 'superacao' | 'gratidao'>('amor');

  if (!isOpen) return null;

  const handleFilesAdded = (filesList: FileList | null) => {
    if (!filesList || filesList.length === 0) return;
    
    const newItems: LocalFileItem[] = Array.from(filesList).map(file => ({
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      file,
      previewUrl: URL.createObjectURL(file)
    }));

    setSelectedFiles(prev => [...prev, ...newItems]);
  };

  const handleRemoveFile = (id: string) => {
    setSelectedFiles(prev => {
      const target = prev.find(item => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter(item => item.id !== id);
    });
  };

  const clearAllFiles = () => {
    selectedFiles.forEach(item => URL.revokeObjectURL(item.previewUrl));
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    setIsUploading(true);
    setUploadProgress({ current: 0, total: selectedFiles.length });

    try {
      let attachments: any[] = [];
      if (selectedFiles.length > 0) {
        const rawFiles = selectedFiles.map(item => item.file);
        const folder = eventType === 'financial' ? 'comprovantes' : 'momentos';
        
        const uploadedList = await uploadMultipleAttachments(
          rawFiles, 
          folder,
          (current, total) => setUploadProgress({ current, total })
        );

        attachments = uploadedList.map((uploaded, idx) => ({
          id: 'rec-' + Date.now() + '-' + idx,
          name: uploaded.name,
          type: uploaded.type,
          url: uploaded.url,
          size: uploaded.size
        }));
      }

      if (eventType === 'financial') {
        const parsedAmount = parseFloat(amount.replace(',', '.'));
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
          setIsUploading(false);
          return;
        }

        onAdd({
          eventType: 'financial',
          title,
          amount: parsedAmount,
          date,
          category,
          description,
          paymentMethod,
          isEssential,
          location: location.trim() || undefined,
          attachments
        });
      } else {
        // Registro de Momento Afetivo
        onAdd({
          eventType: 'moment',
          title,
          date,
          description,
          momentTag,
          emotion,
          location: location.trim() || undefined,
          attachments
        });
      }

      // Limpar campos
      clearAllFiles();
      setTitle('');
      setDescription('');
      setAmount('');
      setLocation('');
      onClose();
    } catch (err) {
      console.error('Erro ao salvar registro:', err);
      alert('Erro ao processar imagens ou salvar registro.');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-zinc-950/95 sm:bg-zinc-950/90 border border-white/10 rounded-t-3xl sm:rounded-2xl p-5 sm:p-8 shadow-2xl backdrop-blur-2xl overflow-hidden max-h-[92vh] sm:max-h-[90vh] flex flex-col">
        {/* Barra de arraste para mobile */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Header com Abas de Seleção de Tipo */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-400" />
            <h2 className="text-base sm:text-lg font-semibold text-white">Criar Novo Registro</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Seletor Visual: Gasto Financeiro vs Momento Afetivo */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-white/[0.04] rounded-xl my-3 sm:my-4 border border-white/5">
          <button
            type="button"
            onClick={() => setEventType('financial')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-2 sm:px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              eventType === 'financial'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            Financeiro
          </button>

          <button
            type="button"
            onClick={() => setEventType('moment')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-2 sm:px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              eventType === 'moment'
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30 font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            Momento
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto space-y-3 sm:space-y-4 flex-1 text-xs pr-1 overscroll-contain">
          <div>
            <label className="block text-zinc-300 font-medium mb-1">
              {eventType === 'financial' ? 'Título do Gasto / Despesa *' : 'Título da Memória / Acontecimento *'}
            </label>
            <input
              type="text"
              required
              placeholder={eventType === 'financial' ? 'Ex: Pensão Alimentícia, Roupas, Dentista...' : 'Ex: Primeiro dia de aula, Passeio de bike, Aniversário...'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 text-sm sm:text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Data *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-blue-500/50 text-sm sm:text-xs"
              />
            </div>

            {eventType === 'financial' ? (
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Valor (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 font-mono text-sm sm:text-xs"
                />
              </div>
            ) : (
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Tipo de Memória</label>
                <select
                  value={momentTag}
                  onChange={(e) => setMomentTag(e.target.value as MomentTag)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-pink-500/50 text-sm sm:text-xs"
                >
                  {Object.entries(MOMENT_TAG_CONFIG).map(([key, cfg]) => (
                    <option key={key} value={key}>
                      {cfg.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Configurações específicas para cada tipo */}
          {eventType === 'financial' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Categoria de Gasto</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-blue-500/50 text-sm sm:text-xs"
                >
                  {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                    <option key={key} value={key}>
                      {cfg.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Forma de Pagamento</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-blue-500/50 text-sm sm:text-xs"
                >
                  <option value="PIX">PIX</option>
                  <option value="Cartão">Cartão</option>
                  <option value="Boleto">Boleto</option>
                  <option value="Transferência">Transferência</option>
                  <option value="Dinheiro">Dinheiro</option>
                </select>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Sentimento / Emoção</label>
              <select
                value={emotion}
                onChange={(e) => setEmotion(e.target.value as any)}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-pink-500/50 text-sm sm:text-xs"
              >
                <option value="amor">Amor & Conexão</option>
                <option value="orgulho">Orgulho</option>
                <option value="alegria">Alegria Pura</option>
                <option value="superacao">Superação & Coragem</option>
                <option value="gratidao">Gratidão</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-zinc-300 font-medium mb-1">Localização (Opcional)</label>
            <input
              type="text"
              placeholder="Ex: Em casa, Parque, Shopping, Colégio..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 text-sm sm:text-xs"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">
              {eventType === 'financial' ? 'Descrição / Observações' : 'História & Detalhes da Lembrança'}
            </label>
            <textarea
              rows={2}
              placeholder={eventType === 'financial' ? 'Descreva notas da compra, especificações ou comprovante...' : 'Conte o que aconteceu, o que ele falou, como foi o dia...'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 text-sm sm:text-xs"
            />
          </div>

          {/* Upload de Múltiplas Imagens (Câmera ou Galeria do Celular) */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-zinc-300 font-medium">
                {eventType === 'financial' ? 'Comprovantes & Recibos' : 'Fotos da Lembrança'}
                {selectedFiles.length > 0 && (
                  <span className="ml-1.5 text-[10px] text-blue-400 font-mono">({selectedFiles.length} foto{selectedFiles.length > 1 ? 's' : ''})</span>
                )}
              </label>

              {selectedFiles.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllFiles}
                  className="text-[10px] text-zinc-500 hover:text-red-400 transition-colors"
                >
                  Limpar todas
                </button>
              )}
            </div>

            {/* Inputs ocultos nativos */}
            <input 
              ref={cameraInputRef}
              type="file" 
              accept="image/*" 
              capture="environment" 
              onChange={(e) => handleFilesAdded(e.target.files)}
              className="hidden" 
            />
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*,application/pdf" 
              multiple 
              onChange={(e) => handleFilesAdded(e.target.files)}
              className="hidden" 
            />

            {/* Galeria de miniaturas de fotos selecionadas */}
            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1 pb-1">
                {selectedFiles.map((item) => (
                  <div key={item.id} className="relative group rounded-lg overflow-hidden border border-white/15 bg-zinc-900 aspect-square">
                    <img 
                      src={item.previewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(item.id)}
                      className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-red-600 text-white rounded-md transition-colors"
                      title="Remover"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Botões para Tirar Foto ou Escolher Várias da Galeria */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-dashed border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.05] active:bg-white/[0.08] text-zinc-300 text-xs font-medium transition-all cursor-pointer touch-manipulation"
              >
                <Camera className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{selectedFiles.length > 0 ? '+ Tirar Outra' : 'Tirar Foto'}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-dashed border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.05] active:bg-white/[0.08] text-zinc-300 text-xs font-medium transition-all cursor-pointer touch-manipulation"
              >
                <ImageIcon className="w-4 h-4 text-pink-400 shrink-0" />
                <span>{selectedFiles.length > 0 ? '+ Mais da Galeria' : 'Escolher Várias'}</span>
              </button>
            </div>
          </div>

          {eventType === 'financial' && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isEssential"
                checked={isEssential}
                onChange={(e) => setIsEssential(e.target.checked)}
                className="w-4 h-4 rounded bg-zinc-900 border-white/20 text-blue-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="isEssential" className="text-zinc-300 text-xs cursor-pointer">
                Gasto Essencial (ex: pensão, escola, saúde)
              </label>
            </div>
          )}

          <div className="pt-3 sm:pt-4 border-t border-white/10 flex items-center justify-end gap-2 sm:gap-3 pb-2 sm:pb-0">
            <button
              type="button"
              disabled={isUploading}
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-zinc-400 hover:text-white transition-colors cursor-pointer text-xs disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className={`flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl font-medium text-white shadow-lg transition-all cursor-pointer text-xs sm:text-sm active:scale-95 disabled:opacity-50 ${
                eventType === 'financial'
                  ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
                  : 'bg-pink-600 hover:bg-pink-500 shadow-pink-600/30'
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {uploadProgress && uploadProgress.total > 1 
                    ? `Enviando (${uploadProgress.current}/${uploadProgress.total})...` 
                    : 'Processando Rápido...'}
                </>
              ) : (
                'Gravar Registro'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
