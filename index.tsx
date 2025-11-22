import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";

// --- Styles (Duolingo-inspired) ---
const styles = {
  container: {
    // Moved layout to CSS .app-container
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  header: {
    // Layout handled by .app-header
    backgroundColor: '#FFFFFF',
    borderBottom: '2px solid #E5E5E5',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
  },
  title: {
    fontWeight: 700,
    color: '#58CC02', // Duo Green
    margin: 0,
    letterSpacing: '-0.5px',
    // FontSize handled by CSS
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  gemCounter: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#FFFFFF',
    border: '2px solid #E5E5E5',
    borderBottom: '4px solid #E5E5E5',
    borderRadius: '16px',
    fontWeight: 700,
    color: '#FF9600', // Duo Orange/Gold
    // Padding/Font handled by CSS
  },
  avatarBtn: {
    borderRadius: '50%',
    backgroundColor: '#1CB0F6',
    border: '2px solid #E5E5E5',
    borderBottom: '4px solid #E5E5E5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.1s',
    // Size handled by CSS
  },
  main: {
    // Moved to .main-content
  },
  inputSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  controlsRow: {
    // Moved to .controls-section
  },
  controlGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    flex: 1,
    minWidth: '150px',
    position: 'relative' as const,
  },
  label: {
    fontSize: '14px',
    color: '#AFAFAF', // Softer grey
    fontWeight: 800,
    marginLeft: '4px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  // Chunky inputs
  select: {
    width: '100%',
    padding: '14px 16px',
    paddingRight: '40px', // Space for custom arrow
    borderRadius: '16px',
    backgroundColor: '#F7F7F7', // Light grey bg
    border: '2px solid #E5E5E5',
    borderBottom: '6px solid #E5E5E5', // 3D effect
    color: '#4B4B4B',
    fontSize: '16px',
    fontWeight: 700, // Bolder text
    outline: 'none',
    cursor: 'pointer',
    transition: 'all 0.1s',
    boxSizing: 'border-box' as const,
    // Custom Blue Rounded Chevron
    backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231CB0F6%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    backgroundSize: '20px auto',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '16px',
    backgroundColor: '#F7F7F7',
    border: '2px solid #E5E5E5',
    borderBottom: '6px solid #E5E5E5',
    color: '#4B4B4B',
    fontSize: '16px',
    fontWeight: 700,
    outline: 'none',
    transition: 'all 0.1s',
    boxSizing: 'border-box' as const,
    fontFamily: '"Nunito", sans-serif',
  },
  // Custom Dropdown Menu Styles
  dropdownMenu: {
    position: 'absolute' as const,
    top: 'calc(100% + 6px)',
    left: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
    border: '2px solid #E5E5E5',
    borderBottom: '4px solid #E5E5E5', // Slightly thinner bottom than main cards
    borderRadius: '16px',
    zIndex: 200,
    maxHeight: '240px',
    overflowY: 'auto' as const,
    boxShadow: '0px 8px 20px rgba(0,0,0,0.15)',
  },
  dropdownItem: {
    padding: '12px 16px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 600,
    color: '#4B4B4B',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  },
  textarea: {
    width: '100%',
    minHeight: '160px',
    padding: '20px',
    borderRadius: '20px',
    backgroundColor: '#F7F7F7',
    border: '2px solid #E5E5E5',
    borderBottom: '6px solid #E5E5E5',
    color: '#4B4B4B',
    fontSize: '18px',
    lineHeight: '1.6',
    fontFamily: '"Nunito", "Quicksand", sans-serif',
    resize: 'vertical' as const,
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'all 0.1s',
  },
  buttonGroup: {
    // Moved to .button-group
  },
  // The "Duolingo" Button Style
  primaryButton: {
    borderRadius: '16px',
    backgroundColor: '#58CC02', // Green
    border: 'none',
    borderBottom: 'none', // using box-shadow for depth
    color: '#fff',
    fontSize: '17px',
    fontWeight: 700,
    cursor: 'pointer',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.8px',
    boxShadow: '0px 6px 0px #58A700', // Darker Green Shadow
    transition: 'all 0.1s',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    position: 'relative' as const,
    top: '0px',
    // Flex props moved to CSS
    padding: '16px 24px',
  },
  secondaryButton: {
    borderRadius: '16px',
    backgroundColor: '#1CB0F6', // Blue
    border: 'none',
    color: '#fff',
    fontSize: '17px',
    fontWeight: 700,
    cursor: 'pointer',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.8px',
    boxShadow: '0px 6px 0px #1899D6', // Darker Blue Shadow
    transition: 'all 0.1s',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    position: 'relative' as const,
    top: '0px',
     // Flex props moved to CSS
     padding: '16px 24px',
  },
  unlockButton: {
    borderRadius: '16px',
    backgroundColor: '#FF9600', // Orange
    border: 'none',
    color: '#fff',
    fontSize: '17px',
    fontWeight: 700,
    cursor: 'pointer',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.8px',
    boxShadow: '0px 6px 0px #CB7700',
    transition: 'all 0.1s',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    position: 'relative' as const,
    top: '0px',
    // Flex props moved to CSS
    padding: '16px 24px',
  },
  dangerButton: {
     padding: '12px 24px',
     borderRadius: '12px',
     backgroundColor: '#FF4B4B',
     border: 'none',
     color: '#fff',
     fontSize: '15px',
     fontWeight: 700,
     cursor: 'pointer',
     boxShadow: '0px 4px 0px #EA2B2B',
     marginTop: '20px',
  },
  neutralButton: {
    padding: '12px 24px',
    borderRadius: '12px',
    backgroundColor: '#E5E5E5',
    border: 'none',
    color: '#4B4B4B',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0px 4px 0px #CFCFCF',
  },
  disabledButton: {
    backgroundColor: '#E5E5E5',
    color: '#AFAFAF',
    boxShadow: 'none',
    cursor: 'not-allowed',
    transform: 'translateY(6px)', // Permanently pressed
  },
  // Grid Cards
  grid: {
    // Moved to .story-grid
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    overflow: 'hidden',
    border: '2px solid #E5E5E5',
    borderBottom: '6px solid #E5E5E5', // 3D Tile look
    display: 'flex',
    flexDirection: 'column' as const,
    transition: 'transform 0.2s, border-color 0.2s',
    cursor: 'pointer',
    position: 'relative' as const,
    zIndex: 10,
  },
  cardImageContainer: {
    width: '100%',
    backgroundColor: '#F7F7F7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    overflow: 'hidden',
    aspectRatio: '16/9',
    borderBottom: '2px solid #E5E5E5',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    display: 'block',
  },
  cardContent: {
    padding: '20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  sceneNumberBadge: {
    fontSize: '14px',
    color: '#1CB0F6',
    fontWeight: 800,
    textTransform: 'uppercase' as const,
  },
  captionText: {
    fontSize: '17px',
    color: '#4B4B4B',
    lineHeight: '1.5',
    fontWeight: 600,
    fontFamily: '"Nunito", sans-serif',
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: 800,
    textTransform: 'uppercase' as const,
  },
  // Overlays
  modal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backdropFilter: 'blur(5px)',
  },
  modalImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    borderRadius: '20px',
    border: '4px solid #FFF',
  },
  closeButton: {
    position: 'absolute' as const,
    top: '24px',
    right: '24px',
    background: '#FF4B4B',
    border: 'none',
    color: '#FFF',
    fontSize: '24px',
    cursor: 'pointer',
    width: '48px',
    height: '48px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 0 #EA2B2B',
  },
  // Profile specific
  profileCard: {
    backgroundColor: '#FFF',
    width: '100%',
    maxWidth: '500px',
    borderRadius: '24px',
    padding: '32px',
    position: 'relative' as const,
    border: '2px solid #E5E5E5',
    borderBottom: '8px solid #E5E5E5',
    textAlign: 'center' as const,
    maxHeight: '90vh',
    overflowY: 'auto' as const
  },
  profileAvatarLarge: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: '#1CB0F6',
    margin: '0 auto 16px auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    border: '4px solid #E5E5E5',
  },
  profileName: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#4B4B4B',
    marginBottom: '8px',
  },
  profileLevel: {
    fontSize: '16px',
    color: '#AFAFAF',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    marginBottom: '32px',
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '32px',
    backgroundColor: '#F7F7F7',
    padding: '20px',
    borderRadius: '20px',
    border: '2px solid #E5E5E5',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: 800,
    color: '#4B4B4B',
  },
  statLabel: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#AFAFAF',
    textTransform: 'uppercase' as const,
  },
  devSettings: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '2px dashed #E5E5E5',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    textAlign: 'left' as const,
  },
  videoProgressModal: {
    position: 'fixed' as const,
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.98)',
    zIndex: 2000,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4B4B4B'
  },
  progressBarContainer: {
    width: '300px',
    height: '24px',
    backgroundColor: '#E5E5E5',
    borderRadius: '12px',
    marginTop: '24px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: '12px',
    transition: 'width 0.3s ease',
  }
};

// --- Global Animations & Reset ---
const globalStyles = `
  body { margin: 0; padding: 0; background-color: #FFFFFF; }
  
  /* Global Styles & Reset */
  .app-container {
     font-family: "Quicksand", "Nunito", "Fredoka", "Varela Round", sans-serif;
  }

  /* Layout Classes (Replacing Desktop-Fixed Inline Styles) */
  .app-header {
    padding: 15px 24px;
  }
  
  .header-title {
    font-size: 24px;
  }
  
  .gem-counter {
    padding: 8px 16px;
    font-size: 16px;
  }
  
  .avatar-btn {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }

  .main-content {
    padding: 40px 20px;
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  .controls-section {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    z-index: 50;
  }
  
  .button-group {
    display: flex;
    gap: 16px;
    margin-top: 10px;
    flex-wrap: wrap;
  }

  /* Action Buttons Default Layout */
  .action-btn {
    flex: 1;
    min-width: 180px;
  }
  .action-btn-primary {
    flex: 2;
    min-width: 200px;
  }

  .story-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
  }

  /* Button Active States for 3D click effect */
  button:active:not(:disabled) {
    transform: translateY(6px) !important;
    box-shadow: none !important;
  }

  /* Focus states for inputs */
  textarea:focus, input:focus, .custom-select-trigger:focus {
    border-color: #1CB0F6 !important;
    border-bottom-color: #1899D6 !important;
  }

  /* Hover states for Selects to make them feel interactive */
  .custom-select-trigger:hover {
    border-color: #1CB0F6 !important;
    border-bottom-color: #1899D6 !important;
  }

  /* Active state for Select (Pressed) */
  .custom-select-trigger:active {
    border-bottom-width: 2px !important;
    transform: translateY(4px) !important;
  }

  /* Card Hover */
  .story-card:hover {
    transform: translateY(-4px);
    border-color: #1CB0F6 !important;
    border-bottom-color: #1899D6 !important;
  }
  
  /* Avatar Hover */
  .avatar-btn:hover {
    transform: scale(1.05);
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  /* --- MOBILE RESPONSIVE OVERRIDES --- */
  @media (max-width: 768px) {
    .app-header {
        padding: 10px 16px !important;
        position: sticky;
        top: 0;
        z-index: 100;
    }
    .header-title {
        font-size: 20px !important;
    }
    .gem-counter {
        padding: 6px 10px !important;
        font-size: 13px !important;
    }
    .avatar-btn {
        width: 36px !important;
        height: 36px !important;
        font-size: 20px !important;
        border-bottom-width: 2px !important;
    }
    
    .main-content {
        padding: 16px 16px !important;
        gap: 20px !important;
    }
    
    /* Controls Grid Layout for Mobile */
    .controls-section {
        display: grid !important;
        grid-template-columns: 1fr 1fr; /* Two columns */
        gap: 12px !important;
        flex-direction: unset !important; /* Override flex column */
    }

    .control-group {
        width: auto !important;
        min-width: 0 !important;
    }

    /* Make the last control (Quality) span full width if it's the 3rd item */
    .control-group:nth-child(3) {
        grid-column: 1 / -1;
    }

    /* Input/Select Compaction */
    .custom-select-trigger, .input-field, textarea {
        padding: 12px 14px !important;
        font-size: 15px !important;
        border-radius: 12px !important;
        border-bottom-width: 4px !important;
    }
    
    textarea {
        min-height: 120px !important;
    }

    .label {
        font-size: 12px !important;
        margin-bottom: 4px !important;
    }

    /* Buttons */
    .button-group {
        flex-direction: column;
        gap: 12px;
    }
    
    .action-btn, .action-btn-primary {
        width: 100% !important;
        padding: 16px !important;
        min-width: 0 !important;
        flex: unset !important;
        font-size: 16px !important;
        border-radius: 12px !important;
        /* Adjust shadows for smaller screens to feel less bulky */
        box-shadow: 0px 4px 0px rgba(0,0,0,0.2) !important; 
    }

    /* Grid Cards */
    .story-grid {
        grid-template-columns: 1fr !important;
        gap: 20px !important;
    }
    
    .story-card {
        border-radius: 16px !important;
        border-bottom-width: 4px !important;
    }
    
    .card-content {
        padding: 16px !important;
    }
    
    .caption-text {
        font-size: 15px !important;
    }

    /* Modal Mobile */
    .profile-card {
        width: 95% !important;
        padding: 20px !important;
        max-height: 85vh;
        overflow-y: auto;
    }
    .profile-avatar-large {
        width: 80px !important;
        height: 80px !important;
        font-size: 40px !important;
    }
    .stats-row {
        gap: 10px;
        padding: 12px !important;
    }
    .stat-value {
        font-size: 18px !important;
    }
  }
`;

// --- Types ---

interface Scene {
  sceneNumber: number;
  visualDescription: string;
  caption: string;
  status: 'pending' | 'generating' | 'completed' | 'error';
  imageUrl?: string;
}

interface Config {
  aspectRatio: string;
  imageSize: '1K' | '2K' | '4K';
  style: string;
}

interface Option {
  value: string;
  label: string;
  icon?: string;
}

// --- Components ---

// Custom Select Component
const CustomSelect = ({ value, onChange, options }: { value: string, onChange: (val: string) => void, options: Option[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div ref={ref} style={{position: 'relative', width: '100%'}} className="control-group">
      <div 
        className="custom-select-trigger"
        style={{
            ...styles.select, 
            display: 'flex',
            alignItems: 'center'
        }} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption ? (
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                {selectedOption.icon && <span>{selectedOption.icon}</span>}
                <span>{selectedOption.label}</span>
            </div>
        ) : value}
      </div>
      
      {isOpen && (
        <div style={styles.dropdownMenu}>
          {options.map((option) => {
             const isSelected = option.value === value;
             return (
                <div 
                  key={option.value}
                  className="dropdown-menu-item"
                  style={{
                    ...styles.dropdownItem,
                    backgroundColor: isSelected ? '#E0F2FE' : 'transparent',
                    color: isSelected ? '#1CB0F6' : '#4B4B4B'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = '#F7F7F7';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                     {option.icon && <span>{option.icon}</span>}
                     <span>{option.label}</span>
                  </div>
                  {isSelected && <span style={{color: '#1CB0F6', fontWeight: 800}}>✓</span>}
                </div>
             );
          })}
        </div>
      )}
    </div>
  );
};

function App() {
  const [script, setScript] = useState('');
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [videoProgress, setVideoProgress] = useState<{current: number, total: number} | null>(null);
  const [usageCount, setUsageCount] = useState(0);
  const [config, setConfig] = useState<Config>({
    aspectRatio: '16:9',
    imageSize: '1K',
    style: 'Cinematic'
  });

  // Custom API State
  const [customApiKey, setCustomApiKey] = useState('');
  const [customBaseUrl, setCustomBaseUrl] = useState('');
  const [showDevSettings, setShowDevSettings] = useState(false);

  const FREE_LIMIT = 2;

  useEffect(() => {
    const stored = localStorage.getItem('storyGenUsage');
    if (stored) setUsageCount(parseInt(stored, 10));

    const storedKey = localStorage.getItem('customApiKey');
    if (storedKey) setCustomApiKey(storedKey);
    
    const storedUrl = localStorage.getItem('customBaseUrl');
    if (storedUrl) setCustomBaseUrl(storedUrl);
  }, []);

  const checkKey = async () => {
    if (window.aistudio) {
      const has = await window.aistudio.hasSelectedApiKey();
      setHasKey(has);
    }
  };

  useEffect(() => {
    checkKey();
    const interval = setInterval(checkKey, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      checkKey();
    }
  };

  const clearData = () => {
    localStorage.removeItem('storyGenUsage');
    setUsageCount(0);
    alert("History cleared!");
  };

  const saveCustomSettings = () => {
    localStorage.setItem('customApiKey', customApiKey);
    localStorage.setItem('customBaseUrl', customBaseUrl);
    setShowDevSettings(false);
    alert("Settings saved! You are now using your custom API configuration.");
  };

  // Logic for generation permissions
  // If customApiKey is present, they are "PRO"
  const isCustomPro = !!customApiKey;
  const remainingFree = Math.max(0, FREE_LIMIT - usageCount);
  const canGenerateUser = hasKey || isCustomPro || remainingFree > 0;

  // Calculate Level based on usage
  const level = Math.floor(usageCount / 3) + 1;
  const roleName = (hasKey || isCustomPro) ? "Magic Director" : "Junior Storyteller";

  const getAiClient = () => {
     const apiKey = customApiKey || process.env.API_KEY;
     const options: any = { apiKey };
     if (customBaseUrl) {
         options.baseUrl = customBaseUrl;
     }
     return new GoogleGenAI(options);
  }

  const generateStoryboard = async () => {
    if (!script.trim()) return;
    if (!canGenerateUser) {
        handleSelectKey();
        return;
    }

    setIsAnalyzing(true);
    setScenes([]);

    // Only increment usage if not pro/custom
    if (!hasKey && !isCustomPro) {
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem('storyGenUsage', newCount.toString());
    }

    try {
      const ai = getAiClient();
      const analysisPrompt = `
        You are an expert storyboard artist for kids. 
        Analyze the script and break it down into a sequence of distinct scenes (3-8 scenes).
        For each scene, provide:
        1. sceneNumber
        2. visualDescription (colorful, cute, highly detailed, optimized for image generation)
        3. caption (simple dialogue or narration)
        
        Style: ${config.style}.
        
        Script: ${script}
      `;

      const analysisResponse = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: analysisPrompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                sceneNumber: { type: Type.INTEGER },
                visualDescription: { type: Type.STRING },
                caption: { type: Type.STRING }
              },
              required: ["sceneNumber", "visualDescription", "caption"]
            }
          }
        }
      });

      const scenesData = JSON.parse(analysisResponse.text || '[]');
      const initialScenes = scenesData.map((s: any) => ({ ...s, status: 'pending' }));
      setScenes(initialScenes);
      setIsAnalyzing(false);
      processSceneGeneration(initialScenes);

    } catch (error) {
      console.error("Analysis error", error);
      setIsAnalyzing(false);
      alert("Something went wrong! If you are using a custom key, check your settings.");
    }
  };

  const processSceneGeneration = async (currentScenes: Scene[]) => {
    let workingScenes = [...currentScenes];
    for (let i = 0; i < workingScenes.length; i++) {
      const scene = workingScenes[i];
      workingScenes[i] = { ...scene, status: 'generating' };
      setScenes([...workingScenes]);

      try {
        const ai = getAiClient();
        const imagePrompt = `Kids friendly ${config.style} style illustration. Bright colors. ${scene.visualDescription}`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-image-preview',
          contents: { parts: [{ text: imagePrompt }] },
          config: {
            imageConfig: {
              aspectRatio: config.aspectRatio,
              imageSize: config.imageSize
            }
          }
        });

        let imageUrl = '';
        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }

        if (imageUrl) {
           workingScenes[i] = { ...scene, status: 'completed', imageUrl };
        } else {
           workingScenes[i] = { ...scene, status: 'error' };
        }

      } catch (err) {
        console.error(`Error generating scene ${scene.sceneNumber}`, err);
        workingScenes[i] = { ...scene, status: 'error' };
      }
      setScenes([...workingScenes]);
    }
  };

  const handleExportVideo = async () => {
    const completedScenes = scenes.filter(s => s.status === 'completed' && s.imageUrl);
    if (completedScenes.length === 0) return;

    let width = 1920;
    let height = 1080;
    if (config.aspectRatio === '4:3') { width = 1440; height = 1080; }
    else if (config.aspectRatio === '1:1') { width = 1080; height = 1080; }
    else if (config.aspectRatio === '9:16') { width = 1080; height = 1920; }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 5000000 });
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.start();
    setVideoProgress({ current: 0, total: completedScenes.length });

    // Draw text helper
    const drawText = (text: string) => {
      const fontSize = Math.floor(height * 0.05); 
      ctx.font = `700 ${fontSize}px "Quicksand", "Nunito", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      
      // Gradient Background
      const gradient = ctx.createLinearGradient(0, height - (height * 0.35), 0, height);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(0.3, 'rgba(0,0,0,0.7)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.9)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, height - (height * 0.4), width, height * 0.4);

      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      const maxWidth = width * 0.85;
      const words = text.split(' ');
      let line = '';
      let lines = [];
      
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);
      const lineHeight = fontSize * 1.4;
      const totalTextHeight = lines.length * lineHeight;
      let y = height - 50 - totalTextHeight + lineHeight;

      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], width / 2, y + (i * lineHeight));
      }
      // Reset shadow
      ctx.shadowColor = 'transparent';
    };

    for (let i = 0; i < completedScenes.length; i++) {
      const scene = completedScenes[i];
      setVideoProgress({ current: i + 1, total: completedScenes.length });
      const img = new Image();
      img.src = scene.imageUrl!;
      await new Promise(resolve => { img.onload = resolve; });
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      drawText(scene.caption);
      await new Promise(resolve => setTimeout(resolve, 4000));
    }

    recorder.stop();
    await new Promise<void>(resolve => { recorder.onstop = () => resolve(); });
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my_story.webm';
    a.click();
    URL.revokeObjectURL(url);
    setVideoProgress(null);
  };

  const getAspectRatioCSS = () => {
    const [w, h] = config.aspectRatio.split(':').map(Number);
    return `${w}/${h}`;
  };

  const getStatusColor = (status: Scene['status']) => {
    switch(status) {
      case 'completed': return '#58CC02';
      case 'generating': return '#FF9600';
      case 'error': return '#FF4B4B';
      default: return '#E5E5E5';
    }
  };
  
  const canGenerate = !isAnalyzing && scenes.every(s => s.status !== 'generating');
  const canExport = scenes.length > 0 && scenes.some(s => s.status === 'completed') && canGenerate;

  return (
    <div style={styles.container} className="app-container">
      <style>{globalStyles}</style>
      
      <header style={styles.header} className="app-header">
        <div style={styles.logoGroup} onClick={() => setShowProfile(false)}>
          <span style={{fontSize: '28px'}}>📚</span>
          <h1 style={styles.title} className="header-title">Story Time</h1>
        </div>
        
        <div style={styles.headerRight}>
          {/* Gamified usage counter */}
          <div style={styles.gemCounter} className="gem-counter">
            {(hasKey || isCustomPro) ? (
               <>
                <span>💎</span>
                <span>Unlimited</span>
               </>
            ) : (
               <>
                <span>⚡</span>
                <span style={remainingFree === 0 ? {color: '#E5E5E5'} : {}}>
                   {remainingFree}
                </span>
               </>
            )}
          </div>
          
          {/* Profile Avatar */}
          <div 
             style={styles.avatarBtn} 
             className="avatar-btn" 
             onClick={() => setShowProfile(true)}
          >
            {(hasKey || isCustomPro) ? '🧙‍♂️' : '🧒'}
          </div>
        </div>
      </header>

      <main style={styles.main} className="main-content">
        <section style={styles.inputSection}>
          {/* Top controls */}
          <div style={styles.controlsRow} className="controls-section">
             <div style={styles.controlGroup} className="control-group">
               <label style={styles.label} className="label">Art Style</label>
               <CustomSelect 
                 value={config.style}
                 onChange={(val) => setConfig({...config, style: val})}
                 options={[
                   { value: "Cinematic", label: "Movie", icon: "🎬" },
                   { value: "Cartoon", label: "Cartoon", icon: "🖍️" },
                   { value: "Anime", label: "Anime", icon: "✨" },
                   { value: "Watercolor", label: "Paint", icon: "🎨" },
                   { value: "Claymation", label: "Clay", icon: "🗿" }
                 ]}
               />
             </div>
             <div style={styles.controlGroup} className="control-group">
               <label style={styles.label} className="label">Shape</label>
               <CustomSelect 
                 value={config.aspectRatio}
                 onChange={(val) => setConfig({...config, aspectRatio: val})}
                 options={[
                   { value: "16:9", label: "Landscape", icon: "🖥️" },
                   { value: "4:3", label: "TV", icon: "📺" },
                   { value: "1:1", label: "Square", icon: "⏹️" },
                   { value: "9:16", label: "Portrait", icon: "📱" }
                 ]}
               />
             </div>
             <div style={styles.controlGroup} className="control-group">
               <label style={styles.label} className="label">Quality</label>
               <CustomSelect 
                 value={config.imageSize}
                 onChange={(val) => setConfig({...config, imageSize: val as any})}
                 options={[
                   { value: "1K", label: "Standard", icon: "⚡" },
                   { value: "2K", label: "HD", icon: "🌟" },
                   { value: "4K", label: "4K Ultra", icon: "💎" }
                 ]}
               />
             </div>
          </div>

          {/* Text Input */}
          <textarea 
            style={styles.textarea}
            placeholder="Once upon a time..."
            value={script}
            onChange={(e) => setScript(e.target.value)}
          />
          
          {/* Buttons */}
          <div style={styles.buttonGroup} className="button-group">
            {canGenerateUser ? (
                <button 
                  style={{
                    ...styles.primaryButton,
                    ...(!canGenerate ? styles.disabledButton : {})
                  }}
                  className="action-btn-primary"
                  onClick={generateStoryboard}
                  disabled={!canGenerate}
                >
                  {isAnalyzing ? 'Thinking...' : '✨ CREATE STORY'}
                </button>
            ) : (
                <button 
                  style={styles.unlockButton}
                  className="action-btn-primary"
                  onClick={handleSelectKey}
                >
                  🔓 UNLOCK UNLIMITED
                </button>
            )}

             <button 
               style={{
                 ...styles.secondaryButton,
                 ...(!canExport ? styles.disabledButton : {})
               }}
               className="action-btn"
               onClick={handleExportVideo}
               disabled={!canExport}
             >
               🎥 EXPORT VIDEO
             </button>
          </div>
        </section>

        {/* Scenes Grid */}
        <div style={styles.grid} className="story-grid">
          {scenes.map((scene) => (
            <div 
              key={scene.sceneNumber} 
              style={styles.card} 
              className="story-card"
              onClick={() => scene.imageUrl && setSelectedImage(scene.imageUrl)}
            >
              <div style={{...styles.cardImageContainer, aspectRatio: getAspectRatioCSS() }}>
                {scene.status === 'completed' && scene.imageUrl ? (
                  <img src={scene.imageUrl} style={styles.image} alt={`Scene ${scene.sceneNumber}`} />
                ) : (
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#ccc'}}>
                    {scene.status === 'generating' ? (
                        <div style={{width: '30px', height: '30px', border: '4px solid #E5E5E5', borderTopColor: '#1CB0F6', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
                    ) : (
                        <span style={{fontSize: '40px'}}>🖼️</span>
                    )}
                  </div>
                )}
              </div>
              
              <div style={styles.cardContent} className="card-content">
                <div style={styles.cardHeader}>
                  <span style={styles.sceneNumberBadge}>SCENE {scene.sceneNumber}</span>
                  {scene.status !== 'completed' && (
                      <span style={{...styles.statusBadge, backgroundColor: getStatusColor(scene.status), color: '#fff'}}>
                        {scene.status}
                      </span>
                  )}
                </div>
                <p style={styles.captionText} className="caption-text">{scene.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Image Modal */}
      {selectedImage && (
        <div style={styles.modal} onClick={() => setSelectedImage(null)}>
          <button style={styles.closeButton}>&times;</button>
          <img src={selectedImage} style={styles.modalImage} alt="Full view" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
      
      {/* Profile View Modal */}
      {showProfile && (
        <div style={styles.modal} onClick={() => setShowProfile(false)}>
          <div style={styles.profileCard} className="profile-card" onClick={e => e.stopPropagation()}>
            <button style={{...styles.closeButton, top: '-20px', right: '-20px'}} onClick={() => setShowProfile(false)}>&times;</button>
            
            <div style={styles.profileAvatarLarge} className="profile-avatar-large">
               {(hasKey || isCustomPro) ? '🧙‍♂️' : '🧒'}
            </div>
            
            <h2 style={styles.profileName}>{roleName}</h2>
            <div style={styles.profileLevel}>Level {level} Creator</div>
            
            <div style={styles.statsRow} className="stats-row">
               <div style={styles.statItem}>
                 <span style={styles.statValue} className="stat-value">{usageCount}</span>
                 <span style={styles.statLabel}>Stories</span>
               </div>
               <div style={styles.statItem}>
                 <span style={styles.statValue} className="stat-value">🔥 3</span>
                 <span style={styles.statLabel}>Streak</span>
               </div>
               <div style={styles.statItem}>
                 <span style={styles.statValue} className="stat-value">{(hasKey || isCustomPro) ? 'PRO' : 'FREE'}</span>
                 <span style={styles.statLabel}>Plan</span>
               </div>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
               {/* Default Login Action */}
               {!isCustomPro && (
                   hasKey ? (
                      <button style={styles.secondaryButton} onClick={handleSelectKey}>
                        🔑 Manage Google Key
                      </button>
                   ) : (
                      <button style={styles.unlockButton} onClick={handleSelectKey}>
                        🔓 Upgrade with Google
                      </button>
                   )
               )}
               
               <button style={styles.neutralButton} onClick={() => setShowDevSettings(!showDevSettings)}>
                  ⚙️ Developer Settings
               </button>

               {showDevSettings && (
                   <div style={styles.devSettings}>
                      <label style={styles.label} className="label">Custom API Key</label>
                      <input 
                         type="password" 
                         style={styles.input} 
                         className="input-field"
                         placeholder="Gemini API Key (sk-...)"
                         value={customApiKey}
                         onChange={e => setCustomApiKey(e.target.value)}
                      />
                      
                      <label style={styles.label} className="label">Base URL (Optional)</label>
                      <input 
                         type="text" 
                         style={styles.input} 
                         className="input-field"
                         placeholder="https://generativelanguage.googleapis.com"
                         value={customBaseUrl}
                         onChange={e => setCustomBaseUrl(e.target.value)}
                      />
                      
                      <button style={styles.primaryButton} onClick={saveCustomSettings}>
                         Save Settings
                      </button>
                   </div>
               )}
               
               <button style={styles.dangerButton} onClick={clearData}>
                  🗑️ Reset Progress
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Progress Modal */}
      {videoProgress && (
        <div style={styles.videoProgressModal}>
          <h2 style={{fontSize: '32px', color: '#1CB0F6', margin: '0 0 10px 0'}}>Making Movie...</h2>
          <p style={{fontSize: '18px', color: '#777'}}>Scene {videoProgress.current} of {videoProgress.total}</p>
          <div style={styles.progressBarContainer}>
            <div 
              style={{
                ...styles.progressBarFill, 
                width: `${(videoProgress.current / videoProgress.total) * 100}%`
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);