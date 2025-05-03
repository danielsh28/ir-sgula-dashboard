
import { getT } from '@/components/I18/i18.helper';

export default async  function DashboardPage() {
  const { t } = await getT();
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Summary Cards */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">{t('dashboard.users')}</h2>
          <p className="text-3xl font-bold">120</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">{t('dashboard.activities')}</h2>
          <p className="text-3xl font-bold">45</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">{t('dashboard.events')}</h2>
          <p className="text-3xl font-bold">12</p>
        </div>
      </div>
      
      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">{t('dashboard.recentActivity')}</h2>
        <div className="space-y-4">
          {/* Activity items */}
          {[1, 2, 3].map((item) => (
            <div key={item} className="border-b pb-4">
              <p className="font-medium">{t('dashboard.activity')} {item}</p>
              <p className="text-sm text-gray-500">{t('dashboard.timeAgo', { time: "2 " + t('common.hours') })}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 