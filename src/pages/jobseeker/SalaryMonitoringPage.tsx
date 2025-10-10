/**
 * 薪酬监控提醒
 * 监控目标职位薪酬变化，第一时间获取市场动态通知
 */

import React, { useState } from 'react';
import { 
  BellIcon,
  SparklesIcon,
  EyeIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MapPinIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import { popularCities } from '@/data/cities';

interface MonitoringRule {
  id: string;
  name: string;
  position: string;
  location: string;
  experience: string;
  company_size: string;
  salary_range: {
    min: number;
    max: number;
  };
  alert_conditions: {
    salary_increase: boolean;
    salary_decrease: boolean;
    new_opportunities: boolean;
    market_trends: boolean;
  };
  notification_frequency: 'immediate' | 'daily' | 'weekly';
  is_active: boolean;
  created_at: string;
  last_alert: string | null;
}

interface SalaryAlert {
  id: string;
  rule_id: string;
  type: 'salary_increase' | 'salary_decrease' | 'new_opportunity' | 'market_trend';
  title: string;
  description: string;
  data: {
    old_value?: number;
    new_value?: number;
    change_percentage?: number;
    company?: string;
    url?: string;
  };
  created_at: string;
  is_read: boolean;
}

interface MarketTrendData {
  position: string;
  location: string;
  trend: 'up' | 'down' | 'stable';
  change_percentage: number;
  current_avg: number;
  previous_avg: number;
  sample_size: number;
  period: string;
}

export const SalaryMonitoringPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rules' | 'alerts' | 'trends' | 'settings'>('rules');
  const [showCreateRule, setShowCreateRule] = useState(false);
  const [editingRule, setEditingRule] = useState<MonitoringRule | null>(null);

  // 监控规则数据
  const [monitoringRules, setMonitoringRules] = useState<MonitoringRule[]>([
    {
      id: 'rule_1',
      name: '高级前端工程师-北京',
      position: '高级前端工程师',
      location: '北京',
      experience: '3-5年',
      company_size: '大型企业',
      salary_range: { min: 25000, max: 40000 },
      alert_conditions: {
        salary_increase: true,
        salary_decrease: true,
        new_opportunities: true,
        market_trends: true
      },
      notification_frequency: 'daily',
      is_active: true,
      created_at: '2024-01-15',
      last_alert: '2024-01-20'
    },
    {
      id: 'rule_2',
      name: '产品经理-上海',
      position: '产品经理',
      location: '上海',
      experience: '5-10年',
      company_size: '中大型企业',
      salary_range: { min: 30000, max: 50000 },
      alert_conditions: {
        salary_increase: true,
        salary_decrease: false,
        new_opportunities: true,
        market_trends: false
      },
      notification_frequency: 'weekly',
      is_active: false,
      created_at: '2024-01-10',
      last_alert: null
    }
  ]);

  // 薪酬提醒数据
  const [salaryAlerts, setSalaryAlerts] = useState<SalaryAlert[]>([
    {
      id: 'alert_1',
      rule_id: 'rule_1',
      type: 'salary_increase',
      title: '高级前端工程师薪酬上涨',
      description: '北京地区高级前端工程师平均薪酬较上月上涨8.5%',
      data: {
        old_value: 28500,
        new_value: 31000,
        change_percentage: 8.5
      },
      created_at: '2024-01-20T10:30:00',
      is_read: false
    },
    {
      id: 'alert_2',
      rule_id: 'rule_1',
      type: 'new_opportunity',
      title: '字节跳动招聘高级前端工程师',
      description: '薪酬范围35-45K，符合你的监控条件',
      data: {
        company: '字节跳动',
        new_value: 40000,
        url: '#'
      },
      created_at: '2024-01-19T15:45:00',
      is_read: true
    },
    {
      id: 'alert_3',
      rule_id: 'rule_1',
      type: 'market_trend',
      title: 'React技能需求激增',
      description: '掌握React技能的前端工程师薪酬溢价达到15%',
      data: {
        change_percentage: 15
      },
      created_at: '2024-01-18T09:15:00',
      is_read: true
    }
  ]);

  // 市场趋势数据
  const marketTrends: MarketTrendData[] = [
    {
      position: '高级前端工程师',
      location: '北京',
      trend: 'up',
      change_percentage: 8.5,
      current_avg: 31000,
      previous_avg: 28500,
      sample_size: 1250,
      period: '近30天'
    },
    {
      position: 'AI算法工程师',
      location: '深圳',
      trend: 'up',
      change_percentage: 15.2,
      current_avg: 45000,
      previous_avg: 39000,
      sample_size: 680,
      period: '近30天'
    },
    {
      position: '产品经理',
      location: '上海',
      trend: 'down',
      change_percentage: -3.2,
      current_avg: 28000,
      previous_avg: 29000,
      sample_size: 980,
      period: '近30天'
    }
  ];

  const tabs = [
    { id: 'rules', label: '监控规则', icon: EyeIcon },
    { id: 'alerts', label: '薪酬提醒', icon: BellIcon },
    { id: 'trends', label: '市场趋势', icon: ChartBarIcon },
    { id: 'settings', label: '设置中心', icon: SparklesIcon }
  ];

  const handleCreateRule = (rule: Omit<MonitoringRule, 'id' | 'created_at' | 'last_alert'>) => {
    const newRule: MonitoringRule = {
      ...rule,
      id: `rule_${Date.now()}`,
      created_at: new Date().toISOString().split('T')[0],
      last_alert: null
    };
    setMonitoringRules(prev => [...prev, newRule]);
    setShowCreateRule(false);
  };

  const handleEditRule = (rule: MonitoringRule) => {
    setMonitoringRules(prev => prev.map(r => r.id === rule.id ? rule : r));
    setEditingRule(null);
  };

  const handleDeleteRule = (ruleId: string) => {
    setMonitoringRules(prev => prev.filter(r => r.id !== ruleId));
  };

  const handleToggleRule = (ruleId: string) => {
    setMonitoringRules(prev => prev.map(r => 
      r.id === ruleId ? { ...r, is_active: !r.is_active } : r
    ));
  };

  const markAlertAsRead = (alertId: string) => {
    setSalaryAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, is_read: true } : alert
    ));
  };

  const unreadCount = salaryAlerts.filter(alert => !alert.is_read).length;

  return (
    <div className="bg-white min-h-screen">
      <div className="container max-w-7xl py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl">
              <BellIcon className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-dsp-dark">薪酬监控提醒</h1>
              <p className="text-dsp-gray mt-1">智能监控市场动态，第一时间获取薪酬变化通知</p>
            </div>
          </div>

          {unreadCount > 0 && (
            <div className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg">
              <BellIcon className="w-4 h-4" />
              <span className="font-medium">{unreadCount} 条未读提醒</span>
            </div>
          )}
        </div>

        {/* 标签导航 */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-dsp-gray hover:text-dsp-dark'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.id === 'alerts' && unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 内容区域 */}
        {activeTab === 'rules' && (
          <MonitoringRulesView 
            rules={monitoringRules}
            onCreateRule={() => setShowCreateRule(true)}
            onEditRule={setEditingRule}
            onDeleteRule={handleDeleteRule}
            onToggleRule={handleToggleRule}
          />
        )}

        {activeTab === 'alerts' && (
          <SalaryAlertsView 
            alerts={salaryAlerts}
            rules={monitoringRules}
            onMarkAsRead={markAlertAsRead}
          />
        )}

        {activeTab === 'trends' && (
          <MarketTrendsView trends={marketTrends} />
        )}

        {activeTab === 'settings' && (
          <SettingsView />
        )}

        {/* 创建规则弹窗 */}
        {showCreateRule && (
          <CreateRuleModal 
            onSave={handleCreateRule}
            onCancel={() => setShowCreateRule(false)}
          />
        )}

        {/* 编辑规则弹窗 */}
        {editingRule && (
          <EditRuleModal 
            rule={editingRule}
            onSave={handleEditRule}
            onCancel={() => setEditingRule(null)}
          />
        )}
      </div>
    </div>
  );
};

// 监控规则视图
const MonitoringRulesView: React.FC<{
  rules: MonitoringRule[];
  onCreateRule: () => void;
  onEditRule: (rule: MonitoringRule) => void;
  onDeleteRule: (ruleId: string) => void;
  onToggleRule: (ruleId: string) => void;
}> = ({ rules, onCreateRule, onEditRule, onDeleteRule, onToggleRule }) => {
  return (
    <div className="space-y-6">
      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-dsp-dark">监控规则管理</h2>
          <p className="text-dsp-gray">设置你关注的职位和薪酬条件</p>
        </div>
        <button
          onClick={onCreateRule}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          <span>创建监控规则</span>
        </button>
      </div>

      {/* 规则列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {rules.map((rule) => (
          <div key={rule.id} className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="space-y-4">
              {/* 规则头部 */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-dsp-dark">{rule.name}</h3>
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      rule.is_active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {rule.is_active ? '运行中' : '已暂停'}
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-dsp-gray">
                    <div className="flex items-center space-x-2">
                      <BriefcaseIcon className="w-3 h-3" />
                      <span>{rule.position}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="w-3 h-3" />
                      <span>{rule.location} • {rule.experience} • {rule.company_size}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEditRule(rule)}
                    className="p-1 text-dsp-gray hover:text-indigo-600 transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteRule(rule.id)}
                    className="p-1 text-dsp-gray hover:text-red-600 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 薪酬范围 */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-dsp-gray">目标薪酬:</span>
                <span className="font-semibold text-dsp-dark">
                  ¥{rule.salary_range.min.toLocaleString()} - ¥{rule.salary_range.max.toLocaleString()}
                </span>
              </div>

              {/* 提醒条件 */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-dsp-dark">提醒条件</div>
                <div className="flex flex-wrap gap-2">
                  {rule.alert_conditions.salary_increase && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      薪酬上涨
                    </span>
                  )}
                  {rule.alert_conditions.salary_decrease && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                      薪酬下跌
                    </span>
                  )}
                  {rule.alert_conditions.new_opportunities && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      新机会
                    </span>
                  )}
                  {rule.alert_conditions.market_trends && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      市场趋势
                    </span>
                  )}
                </div>
              </div>

              {/* 规则状态和操作 */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-xs text-dsp-gray">
                  <div>创建时间: {rule.created_at}</div>
                  {rule.last_alert && <div>最后提醒: {rule.last_alert}</div>}
                </div>
                
                <button
                  onClick={() => onToggleRule(rule.id)}
                  className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                    rule.is_active
                      ? 'bg-gray-100 text-dsp-gray hover:bg-gray-200'
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  }`}
                >
                  {rule.is_active ? '暂停' : '启用'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {rules.length === 0 && (
        <div className="text-center py-20">
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="p-4 bg-gray-100 rounded-2xl">
                <EyeIcon className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-dsp-dark mb-2">还没有监控规则</h3>
              <p className="text-dsp-gray">创建你的第一个薪酬监控规则，开始追踪市场动态</p>
            </div>
            <button
              onClick={onCreateRule}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              创建监控规则
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// 薪酬提醒视图
const SalaryAlertsView: React.FC<{
  alerts: SalaryAlert[];
  rules: MonitoringRule[];
  onMarkAsRead: (alertId: string) => void;
}> = ({ alerts, rules, onMarkAsRead }) => {
  const getRuleName = (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    return rule ? rule.name : '未知规则';
  };

  const getAlertIcon = (type: SalaryAlert['type']) => {
    switch (type) {
      case 'salary_increase':
        return <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />;
      case 'salary_decrease':
        return <ArrowTrendingDownIcon className="w-5 h-5 text-red-600" />;
      case 'new_opportunity':
        return <BriefcaseIcon className="w-5 h-5 text-blue-600" />;
      case 'market_trend':
        return <ChartBarIcon className="w-5 h-5 text-purple-600" />;
    }
  };

  const getAlertColor = (type: SalaryAlert['type']) => {
    switch (type) {
      case 'salary_increase':
        return 'border-green-200 bg-green-50';
      case 'salary_decrease':
        return 'border-red-200 bg-red-50';
      case 'new_opportunity':
        return 'border-blue-200 bg-blue-50';
      case 'market_trend':
        return 'border-purple-200 bg-purple-50';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-dsp-dark mb-2">薪酬提醒</h2>
        <p className="text-dsp-gray">查看最新的薪酬变化和市场动态</p>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`border rounded-2xl p-6 transition-all ${
              alert.is_read 
                ? 'border-gray-200 bg-white' 
                : `${getAlertColor(alert.type)} border-l-4`
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                {getAlertIcon(alert.type)}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-dsp-dark">{alert.title}</h3>
                    <p className="text-dsp-gray">{alert.description}</p>
                  </div>
                  
                  {!alert.is_read && (
                    <button
                      onClick={() => onMarkAsRead(alert.id)}
                      className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                    >
                      标记已读
                    </button>
                  )}
                </div>

                {/* 详细数据 */}
                {alert.data && (
                  <div className="space-y-2">
                    {alert.data.old_value && alert.data.new_value && (
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-dsp-gray">
                          变化: ¥{alert.data.old_value.toLocaleString()} → ¥{alert.data.new_value.toLocaleString()}
                        </span>
                        {alert.data.change_percentage && (
                          <span className={`font-medium ${
                            alert.data.change_percentage > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {alert.data.change_percentage > 0 ? '+' : ''}{alert.data.change_percentage}%
                          </span>
                        )}
                      </div>
                    )}
                    
                    {alert.data.company && (
                      <div className="text-sm text-dsp-gray">
                        公司: {alert.data.company}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-dsp-gray pt-2 border-t border-gray-200">
                  <span>来源: {getRuleName(alert.rule_id)}</span>
                  <span>{new Date(alert.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {alerts.length === 0 && (
        <div className="text-center py-20">
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="p-4 bg-gray-100 rounded-2xl">
                <BellIcon className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-dsp-dark mb-2">暂无提醒</h3>
              <p className="text-dsp-gray">当有薪酬变化或新机会时，你会在这里看到提醒</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 市场趋势视图
const MarketTrendsView: React.FC<{ trends: MarketTrendData[] }> = ({ trends }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-dsp-dark mb-2">市场趋势分析</h2>
        <p className="text-dsp-gray">实时追踪各职位的薪酬变化趋势</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trends.map((trend, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="space-y-4">
              {/* 趋势头部 */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-dsp-dark">{trend.position}</h3>
                  <div className="flex items-center space-x-2 text-sm text-dsp-gray">
                    <MapPinIcon className="w-3 h-3" />
                    <span>{trend.location}</span>
                    <span>•</span>
                    <span>{trend.period}</span>
                  </div>
                </div>
                
                <div className="text-right">
                <div className={`flex items-center space-x-1 ${
                  trend.trend === 'up' ? 'text-green-600' :
                  trend.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {trend.trend === 'up' ? (
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                  ) : trend.trend === 'down' ? (
                    <ArrowTrendingDownIcon className="w-4 h-4" />
                  ) : (
                    <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                  )}
                  <span className="font-semibold">
                    {trend.change_percentage > 0 ? '+' : ''}{trend.change_percentage}%
                  </span>
                </div>
                </div>
              </div>

              {/* 薪酬数据 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-dsp-dark">
                    ¥{trend.current_avg.toLocaleString()}
                  </div>
                  <div className="text-xs text-dsp-gray">当前平均</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-dsp-dark">
                    ¥{trend.previous_avg.toLocaleString()}
                  </div>
                  <div className="text-xs text-dsp-gray">上期平均</div>
                </div>
              </div>

              {/* 样本信息 */}
              <div className="flex items-center justify-between text-sm text-dsp-gray pt-2 border-t border-gray-200">
                <span>样本数量: {trend.sample_size.toLocaleString()} 个</span>
                <span>数据更新: 1小时前</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 设置中心视图
const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState({
    email_notifications: true,
    push_notifications: true,
    wechat_notifications: false,
    notification_time: '09:00',
    weekend_notifications: false,
    alert_threshold: 5,
    auto_pause_inactive: true
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-dsp-dark mb-2">设置中心</h2>
        <p className="text-dsp-gray">自定义你的通知偏好和监控设置</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 通知设置 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-semibold text-dsp-dark mb-4">通知设置</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-dsp-dark">邮件通知</div>
                <div className="text-sm text-dsp-gray">通过邮件接收薪酬提醒</div>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, email_notifications: !prev.email_notifications }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.email_notifications ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.email_notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-dsp-dark">浏览器推送</div>
                <div className="text-sm text-dsp-gray">在浏览器中显示通知</div>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, push_notifications: !prev.push_notifications }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.push_notifications ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.push_notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-dsp-dark">微信通知</div>
                <div className="text-sm text-dsp-gray">通过微信公众号推送</div>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, wechat_notifications: !prev.wechat_notifications }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.wechat_notifications ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.wechat_notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 监控设置 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-semibold text-dsp-dark mb-4">监控设置</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dsp-dark mb-2">
                通知时间
              </label>
              <input
                type="time"
                value={settings.notification_time}
                onChange={(e) => setSettings(prev => ({ ...prev, notification_time: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dsp-dark mb-2">
                薪酬变化阈值 (%)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={settings.alert_threshold}
                onChange={(e) => setSettings(prev => ({ ...prev, alert_threshold: parseInt(e.target.value) || 5 }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <div className="text-xs text-dsp-gray mt-1">
                当薪酬变化超过此百分比时发送提醒
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-dsp-dark">周末通知</div>
                <div className="text-sm text-dsp-gray">在周末接收通知</div>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, weekend_notifications: !prev.weekend_notifications }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.weekend_notifications ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.weekend_notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-dsp-dark">自动暂停非活跃规则</div>
                <div className="text-sm text-dsp-gray">30天无匹配时自动暂停</div>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, auto_pause_inactive: !prev.auto_pause_inactive }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.auto_pause_inactive ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.auto_pause_inactive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 保存按钮 */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
          保存设置
        </button>
      </div>
    </div>
  );
};

// 创建规则弹窗
const CreateRuleModal: React.FC<{
  onSave: (rule: Omit<MonitoringRule, 'id' | 'created_at' | 'last_alert'>) => void;
  onCancel: () => void;
}> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    location: '',
    experience: '',
    company_size: '',
    salary_min: '',
    salary_max: '',
    salary_increase: true,
    salary_decrease: false,
    new_opportunities: true,
    market_trends: false,
    notification_frequency: 'daily' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const rule: Omit<MonitoringRule, 'id' | 'created_at' | 'last_alert'> = {
      name: formData.name,
      position: formData.position,
      location: formData.location,
      experience: formData.experience,
      company_size: formData.company_size,
      salary_range: {
        min: parseInt(formData.salary_min),
        max: parseInt(formData.salary_max)
      },
      alert_conditions: {
        salary_increase: formData.salary_increase,
        salary_decrease: formData.salary_decrease,
        new_opportunities: formData.new_opportunities,
        market_trends: formData.market_trends
      },
      notification_frequency: formData.notification_frequency,
      is_active: true
    };
    
    onSave(rule);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold text-dsp-dark mb-6">创建监控规则</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dsp-dark mb-2">
                规则名称 *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="如：高级前端-北京"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dsp-dark mb-2">
                目标职位 *
              </label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="如：高级前端工程师"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-dsp-dark mb-2">
                工作地点 *
              </label>
              <select
                required
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="">请选择</option>
                {popularCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dsp-dark mb-2">
                工作经验 *
              </label>
              <select
                required
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="">请选择</option>
                <option value="应届生">应届生</option>
                <option value="1-3年">1-3年</option>
                <option value="3-5年">3-5年</option>
                <option value="5-10年">5-10年</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dsp-dark mb-2">
                公司规模
              </label>
              <select
                value={formData.company_size}
                onChange={(e) => setFormData(prev => ({ ...prev, company_size: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="">不限</option>
                <option value="创业公司">创业公司</option>
                <option value="中小企业">中小企业</option>
                <option value="大型企业">大型企业</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dsp-dark mb-2">
                最低薪酬 *
              </label>
              <input
                type="number"
                required
                value={formData.salary_min}
                onChange={(e) => setFormData(prev => ({ ...prev, salary_min: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="如：20000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dsp-dark mb-2">
                最高薪酬 *
              </label>
              <input
                type="number"
                required
                value={formData.salary_max}
                onChange={(e) => setFormData(prev => ({ ...prev, salary_max: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="如：35000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dsp-dark mb-3">
              提醒条件
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.salary_increase}
                  onChange={(e) => setFormData(prev => ({ ...prev, salary_increase: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm text-dsp-dark">薪酬上涨时提醒</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.salary_decrease}
                  onChange={(e) => setFormData(prev => ({ ...prev, salary_decrease: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm text-dsp-dark">薪酬下跌时提醒</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.new_opportunities}
                  onChange={(e) => setFormData(prev => ({ ...prev, new_opportunities: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm text-dsp-dark">有新机会时提醒</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.market_trends}
                  onChange={(e) => setFormData(prev => ({ ...prev, market_trends: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm text-dsp-dark">市场趋势变化时提醒</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dsp-dark mb-2">
              通知频率
            </label>
            <select
              value={formData.notification_frequency}
              onChange={(e) => setFormData(prev => ({ ...prev, notification_frequency: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="immediate">立即通知</option>
              <option value="daily">每日汇总</option>
              <option value="weekly">每周汇总</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-dsp-gray hover:text-dsp-dark transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              创建规则
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 编辑规则弹窗 (简化版，重用CreateRuleModal的逻辑)
const EditRuleModal: React.FC<{
  rule: MonitoringRule;
  onSave: (rule: MonitoringRule) => void;
  onCancel: () => void;
}> = ({ rule, onSave, onCancel }) => {
  // 这里可以复用CreateRuleModal的逻辑，预填充数据
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold text-dsp-dark mb-4">编辑监控规则</h3>
        <p className="text-dsp-gray mb-6">编辑功能开发中，敬请期待...</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-dsp-gray hover:text-dsp-dark transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => onSave(rule)}
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};
