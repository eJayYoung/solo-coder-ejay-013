import { useState, useEffect, useCallback } from 'react';
import { Map } from './components/Map';
import { ToiletDetail } from './components/ToiletDetail';
import { ReportForm } from './components/ReportForm';
import { ToiletList } from './components/ToiletList';
import { mockToilets, filterToiletsByRadius } from './data/toilets';
import { Toilet, UserLocation, ReportData } from './types';

const RADIUS = 2000;

function App() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [toilets, setToilets] = useState<Toilet[]>([]);
  const [selectedToilet, setSelectedToilet] = useState<Toilet | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  const fetchLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: UserLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          const nearbyToilets = filterToiletsByRadius(
            mockToilets.filter(t => t.status === 'approved'),
            location.lat,
            location.lng,
            RADIUS
          );
          setToilets(nearbyToilets);
          setLoading(false);
        },
        () => {
          const defaultLocation: UserLocation = {
            lat: 39.9087,
            lng: 116.3975
          };
          setUserLocation(defaultLocation);
          const nearbyToilets = filterToiletsByRadius(
            mockToilets.filter(t => t.status === 'approved'),
            defaultLocation.lat,
            defaultLocation.lng,
            RADIUS
          );
          setToilets(nearbyToilets);
          setLoading(false);
        }
      );
    } else {
      const defaultLocation: UserLocation = {
        lat: 39.9087,
        lng: 116.3975
      };
      setUserLocation(defaultLocation);
      const nearbyToilets = filterToiletsByRadius(
        mockToilets.filter(t => t.status === 'approved'),
        defaultLocation.lat,
        defaultLocation.lng,
        RADIUS
      );
      setToilets(nearbyToilets);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  const handleToiletClick = (toilet: Toilet) => {
    setSelectedToilet(toilet);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedToilet(null);
  };

  const handleNavigate = (toilet: Toilet) => {
    if (!userLocation) return;
    
    const url = `https://maps.apple.com/?daddr=${toilet.lat},${toilet.lng}&saddr=${userLocation.lat},${userLocation.lng}`;
    window.open(url, '_blank');
  };

  const handleReportSubmit = (data: ReportData) => {
    setPendingCount(prev => prev + 1);
    setShowReportForm(false);
    alert('上报成功！您的信息将在审核通过后显示在地图上。');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow-sm px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                <path d="M7 12h2v5H7zm4-3h2v8h-2zm4-3h2v11h-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">附近厕所</h1>
              <p className="text-xs text-gray-500">查找半径{RADIUS / 1000}公里内的公共厕所</p>
            </div>
          </div>
          {pendingCount > 0 && (
            <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
              {pendingCount} 条待审核
            </div>
          )}
        </div>
      </header>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500">获取位置中...</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-1 h-[50vh] lg:h-full">
            <Map
              toilets={toilets}
              userLocation={userLocation}
              onToiletClick={handleToiletClick}
              onReportClick={() => setShowReportForm(true)}
              selectedToilet={selectedToilet}
            />
          </div>

          <div className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  找到 <span className="text-blue-600 font-bold">{toilets.length}</span> 个厕所
                </span>
                <button
                  onClick={fetchLocation}
                  className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  刷新
                </button>
              </div>
            </div>
            <div className="p-4">
              <ToiletList
                toilets={toilets}
                onToiletClick={handleToiletClick}
                selectedToilet={selectedToilet}
              />
            </div>
          </div>
        </div>
      )}

      {showDetail && selectedToilet && (
        <ToiletDetail
          toilet={selectedToilet}
          onClose={handleCloseDetail}
          onNavigate={handleNavigate}
        />
      )}

      {showReportForm && (
        <ReportForm
          onSubmit={handleReportSubmit}
          onClose={() => setShowReportForm(false)}
          userLocation={userLocation}
        />
      )}
    </div>
  );
}

export default App;
