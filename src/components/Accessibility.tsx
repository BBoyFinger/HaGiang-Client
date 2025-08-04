import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash, FaFont, FaMinus, FaPlus } from 'react-icons/fa';

interface AccessibilityProps {
  className?: string;
}

const Accessibility: React.FC<AccessibilityProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedFontSize = localStorage.getItem('accessibility-fontSize');
    const savedHighContrast = localStorage.getItem('accessibility-highContrast');
    const savedReducedMotion = localStorage.getItem('accessibility-reducedMotion');

    if (savedFontSize) setFontSize(parseInt(savedFontSize));
    if (savedHighContrast) setHighContrast(savedHighContrast === 'true');
    if (savedReducedMotion) setReducedMotion(savedReducedMotion === 'true');
  }, []);

  // Apply accessibility settings
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    root.style.fontSize = `${fontSize}px`;
    localStorage.setItem('accessibility-fontSize', fontSize.toString());

    // High contrast
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    localStorage.setItem('accessibility-highContrast', highContrast.toString());

    // Reduced motion
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    localStorage.setItem('accessibility-reducedMotion', reducedMotion.toString());
  }, [fontSize, highContrast, reducedMotion]);

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12));
  };

  const resetFontSize = () => {
    setFontSize(16);
  };

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };

  const toggleReducedMotion = () => {
    setReducedMotion(prev => !prev);
  };

  return (
    <div className={`accessibility-widget ${className}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="accessibility-toggle"
        aria-label="Mở cài đặt trợ năng"
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
      >
        <FaEye className="w-5 h-5" />
        <span className="sr-only">Trợ năng</span>
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          id="accessibility-panel"
          className="accessibility-panel"
          role="dialog"
          aria-labelledby="accessibility-title"
          aria-describedby="accessibility-description"
        >
          <div className="accessibility-header">
            <h3 id="accessibility-title" className="accessibility-title">
              Cài đặt trợ năng
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="accessibility-close"
              aria-label="Đóng cài đặt trợ năng"
            >
              ×
            </button>
          </div>

          <div id="accessibility-description" className="accessibility-content">
            {/* Font Size Controls */}
            <div className="accessibility-section">
              <h4 className="accessibility-section-title">
                <FaFont className="w-4 h-4" />
                Cỡ chữ
              </h4>
              <div className="accessibility-controls">
                <button
                  onClick={decreaseFontSize}
                  className="accessibility-btn"
                  aria-label="Giảm cỡ chữ"
                  disabled={fontSize <= 12}
                >
                  <FaMinus className="w-3 h-3" />
                </button>
                <span className="accessibility-value">{fontSize}px</span>
                <button
                  onClick={increaseFontSize}
                  className="accessibility-btn"
                  aria-label="Tăng cỡ chữ"
                  disabled={fontSize >= 24}
                >
                  <FaPlus className="w-3 h-3" />
                </button>
                <button
                  onClick={resetFontSize}
                  className="accessibility-reset"
                  aria-label="Đặt lại cỡ chữ"
                >
                  Mặc định
                </button>
              </div>
            </div>

            {/* High Contrast Toggle */}
            <div className="accessibility-section">
              <h4 className="accessibility-section-title">
                <FaEye className="w-4 h-4" />
                Độ tương phản cao
              </h4>
              <button
                onClick={toggleHighContrast}
                className={`accessibility-toggle-btn ${highContrast ? 'active' : ''}`}
                aria-pressed={highContrast}
                aria-label={`${highContrast ? 'Tắt' : 'Bật'} độ tương phản cao`}
              >
                {highContrast ? 'Bật' : 'Tắt'}
              </button>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="accessibility-section">
              <h4 className="accessibility-section-title">
                <FaEyeSlash className="w-4 h-4" />
                Giảm chuyển động
              </h4>
              <button
                onClick={toggleReducedMotion}
                className={`accessibility-toggle-btn ${reducedMotion ? 'active' : ''}`}
                aria-pressed={reducedMotion}
                aria-label={`${reducedMotion ? 'Tắt' : 'Bật'} giảm chuyển động`}
              >
                {reducedMotion ? 'Bật' : 'Tắt'}
              </button>
            </div>

            {/* Keyboard Navigation Info */}
            <div className="accessibility-section">
              <h4 className="accessibility-section-title">Điều hướng bàn phím</h4>
              <div className="accessibility-info">
                <p>• Sử dụng Tab để di chuyển giữa các phần tử</p>
                <p>• Sử dụng Enter hoặc Space để kích hoạt</p>
                <p>• Sử dụng Escape để đóng modal</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .accessibility-widget {
          position: fixed;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          z-index: 1000;
        }

        .accessibility-toggle {
          background: #059669;
          color: white;
          border: none;
          border-radius: 8px 0 0 8px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .accessibility-toggle:hover {
          background: #047857;
          transform: translateX(-2px);
        }

        .accessibility-panel {
          position: absolute;
          right: 0;
          top: 0;
          width: 320px;
          background: white;
          border-radius: 8px 0 8px 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          border: 1px solid #e5e7eb;
        }

        .accessibility-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
          border-radius: 8px 0 0 0;
        }

        .accessibility-title {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .accessibility-close {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #6b7280;
          padding: 4px;
          border-radius: 4px;
        }

        .accessibility-close:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .accessibility-content {
          padding: 16px;
        }

        .accessibility-section {
          margin-bottom: 20px;
        }

        .accessibility-section:last-child {
          margin-bottom: 0;
        }

        .accessibility-section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 12px 0;
        }

        .accessibility-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .accessibility-btn {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 8px 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .accessibility-btn:hover:not(:disabled) {
          background: #e5e7eb;
          border-color: #9ca3af;
        }

        .accessibility-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .accessibility-value {
          font-weight: 600;
          color: #374151;
          min-width: 40px;
          text-align: center;
        }

        .accessibility-reset {
          background: #059669;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 12px;
          transition: background 0.2s ease;
        }

        .accessibility-reset:hover {
          background: #047857;
        }

        .accessibility-toggle-btn {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 8px 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .accessibility-toggle-btn:hover {
          background: #e5e7eb;
        }

        .accessibility-toggle-btn.active {
          background: #059669;
          color: white;
          border-color: #059669;
        }

        .accessibility-info {
          font-size: 12px;
          color: #6b7280;
          line-height: 1.5;
        }

        .accessibility-info p {
          margin: 4px 0;
        }

        /* High contrast styles */
        .high-contrast {
          filter: contrast(150%);
        }

        .high-contrast * {
          border-color: #000 !important;
        }

        /* Reduced motion styles */
        .reduced-motion * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }

        /* Screen reader only */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        @media (max-width: 768px) {
          .accessibility-panel {
            width: 280px;
          }
        }
      `}</style>
    </div>
  );
};

export default Accessibility; 