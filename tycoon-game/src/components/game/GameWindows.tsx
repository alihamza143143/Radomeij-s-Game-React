import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import Bank from '../Bank';
import CreatedProducts from '../CreatedProducts';
import CurrentProductList from '../CurrentProductList';
import DailyMarket from '../DailyMarket';
import HardwareDevelopment from '../HardwareDevelopment';
import Marketing from '../Marketing';
import ProductList from '../devs/ProductList';
import Research from '../Research';
import ReviewHistory from '../ReviewHistory';
import SalesDashboard from '../SalesDashboard';
import SaveGame from '../SaveGame';
import Settings from '../Settings';
import TotalMarket from '../TotalMarket';
import Window from '../Window';
import ConsumerPopulationChart from '../devs/ConsumerPopulationChart';
import GameMainMenu from '../GameMainMenu';
import HardwareCompletionModal from '../HardwareCompletionModal';
import LoseMenu from '../LoseMenu';
import OfficeSelectView from '../office/OfficeSelectView';
import EmployeeList from '../employee/EmployeeList';
import RecruitEmployee from '../employee/RecruitEmployee';
import EventWindow from '../events/EventWindow';
import { selectProduct, deselectProduct } from '@/store/productReviewSlice';
import { deselectEvent } from '@/store/eventSlice';

interface GameWindowsProps {
  activeWindow: string | null;
  setActiveWindow: (window: string | null) => void;
  onExitToMainMenu: () => void;
}

const GameWindows: React.FC<GameWindowsProps> = ({ activeWindow, setActiveWindow, onExitToMainMenu }) => {
  const dispatch: AppDispatch = useDispatch();
  const selectedProductId = useSelector((state: RootState) => state.productReview.selectedProductId);
  const incomingEventId = useSelector((state: RootState) => state.events.incomingEventId); // Get the incoming event ID
  const lose = useSelector((state: RootState) => state.game.lose); // Check if the player has lost

  const handleShowReviewModal = (productId: number) => {
    dispatch(selectProduct(productId));
  };

  const handleCloseCompletionModal = () => {
    dispatch(deselectProduct());
  };

  const handleCloseEventModal = () => {
    dispatch(deselectEvent());
  };

  return (
    <>
      {activeWindow === 'Research' && <Window title="Research" onClose={() => setActiveWindow(null)}><Research /></Window>}
      {activeWindow === 'Bank' && <Window title="Bank" onClose={() => setActiveWindow(null)}><Bank /></Window>}
      {activeWindow === 'Market' && <Window title="Market" onClose={() => setActiveWindow(null)}><TotalMarket /></Window>}
      {activeWindow === 'DailyMarket' && <Window title="Market" onClose={() => setActiveWindow(null)}><DailyMarket /></Window>}
      {activeWindow === 'HardwareDevelopment' && <Window title="Hardware Development" onClose={() => setActiveWindow(null)}><HardwareDevelopment onClose={() => setActiveWindow(null)} /></Window>}
      {activeWindow === 'ProductList' && <Window title="Product List" onClose={() => setActiveWindow(null)}><ProductList /></Window>}
      {activeWindow === 'CurrentProductList' && <Window title="Current Products" onClose={() => setActiveWindow(null)}><CurrentProductList /></Window>}
      {activeWindow === 'CreatedProducts' && <Window title="Created Products" onClose={() => setActiveWindow(null)}><CreatedProducts /></Window>}
      {activeWindow === 'Marketing' && <Window title="Marketing" onClose={() => setActiveWindow(null)}><Marketing onClose={() => setActiveWindow(null)} /></Window>}
      {activeWindow === 'Settings' && <Window title="Settings" onClose={() => setActiveWindow(null)}><Settings /></Window>}
      {activeWindow === 'ReviewHistory' && <Window title="Review History" onClose={() => setActiveWindow(null)}><ReviewHistory onSelectReview={handleShowReviewModal} /></Window>}
      {activeWindow === 'SalesDashboard' && <Window title="Sales Dashboard" onClose={() => setActiveWindow(null)}><SalesDashboard /></Window>}
      {activeWindow === 'SaveGame' && <Window title="Save" onClose={() => setActiveWindow(null)}><SaveGame onClose={() => setActiveWindow(null)} /></Window>}
      {activeWindow === 'ConsumentsList' && <Window title="ConsumentsList" onClose={() => setActiveWindow(null)}><ConsumerPopulationChart /></Window>}
      {activeWindow === 'MoveOffice' && <Window title="MoveOffice" onClose={() => setActiveWindow(null)}><OfficeSelectView /></Window>}
      {activeWindow === 'ListOfEmployees' && <Window title="ListOfEmployees" onClose={() => setActiveWindow(null)}><EmployeeList /></Window>}
      {activeWindow === 'HireEmployee' && <Window title="HireEmployee" onClose={() => setActiveWindow(null)}><RecruitEmployee /></Window>}
      {activeWindow === 'MainMenu' && <GameMainMenu onSwitch={(windowName) => setActiveWindow(windowName)} onExitToMainMenu={onExitToMainMenu} />}

      {selectedProductId !== null && (
        <Window title="Review" onClose={() => dispatch(deselectProduct())}><HardwareCompletionModal productId={selectedProductId} onClose={handleCloseCompletionModal} playAnimation={true} /></Window>
      )}

      {incomingEventId !== null && (
       <EventWindow eventId={incomingEventId} onClose={handleCloseEventModal} />
      )}

      {lose && <LoseMenu onExitToMainMenu={onExitToMainMenu} />} {/* Conditionally render LoseMenu if lose is true */}
    </>
  );
};

export default GameWindows;
