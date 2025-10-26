import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function ChatButton() {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isOnChatPage = location.pathname === '/chat';

  const handleClick = () => {
    if (isOnChatPage) {
      // Si ya estamos en chat, volver a la página anterior
      navigate(-1);
    } else {
      // Si no estamos en chat, ir a chat
      navigate('/chat');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
          isOnChatPage
            ? 'bg-accent-red hover:bg-accent-red/80'
            : 'bg-gradient-to-br from-accent-blue to-accent-purple hover:from-accent-blue/80 hover:to-accent-purple/80'
        }`}
      >
        {/* Icon */}
        {isOnChatPage ? (
          <X className="w-6 h-6 text-white transition-transform group-hover:rotate-90 duration-300" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white transition-transform group-hover:scale-110 duration-300" />
        )}

        {/* Tooltip */}
        {isHovered && (
          <div className="absolute right-full mr-3 whitespace-nowrap bg-dark-800 text-white px-3 py-2 rounded-lg shadow-lg border border-dark-600 text-sm font-medium">
            {isOnChatPage ? 'Cerrar Chat' : 'Abrir Chat de Trading'}
            <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-dark-800 rotate-45 border-r border-b border-dark-600"></div>
          </div>
        )}
      </button>
    </div>
  );
}

export default ChatButton;

