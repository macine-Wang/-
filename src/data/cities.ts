/**
 * 中国城市数据
 * 提供全国主要城市的分类数据，供各功能模块调用
 */

// 城市级别定义
export type CityLevel = 'first-tier' | 'new-first-tier' | 'second-tier' | 'third-tier' | 'other';

// 地理区域定义
export type Region = 'north' | 'northeast' | 'east' | 'south' | 'southwest' | 'northwest' | 'central';

// 城市数据接口
export interface CityData {
  name: string;           // 城市名称
  code: string;          // 城市代码
  province: string;      // 所属省份
  region: Region;        // 地理区域
  level: CityLevel;      // 城市级别
  population?: number;   // 人口数量（万人）
  gdp?: number;         // GDP（亿元）
  alias?: string[];     // 别名（如：北京市、京）
}

// 完整城市数据
export const citiesData: CityData[] = [
  // 一线城市
  { name: '北京', code: 'BJ', province: '北京市', region: 'north', level: 'first-tier', population: 2171, gdp: 41610, alias: ['北京市', '京'] },
  { name: '上海', code: 'SH', province: '上海市', region: 'east', level: 'first-tier', population: 2424, gdp: 43214, alias: ['上海市', '沪'] },
  { name: '广州', code: 'GZ', province: '广东省', region: 'south', level: 'first-tier', population: 1868, gdp: 28839, alias: ['广州市', '穗'] },
  { name: '深圳', code: 'SZ', province: '广东省', region: 'south', level: 'first-tier', population: 1756, gdp: 32387, alias: ['深圳市', '深'] },

  // 新一线城市
  { name: '成都', code: 'CD', province: '四川省', region: 'southwest', level: 'new-first-tier', population: 2119, gdp: 20817, alias: ['成都市', '蓉'] },
  { name: '重庆', code: 'CQ', province: '重庆市', region: 'southwest', level: 'new-first-tier', population: 3213, gdp: 27894, alias: ['重庆市', '渝'] },
  { name: '杭州', code: 'HZ', province: '浙江省', region: 'east', level: 'new-first-tier', population: 1220, gdp: 18753, alias: ['杭州市'] },
  { name: '武汉', code: 'WH', province: '湖北省', region: 'central', level: 'new-first-tier', population: 1364, gdp: 18866, alias: ['武汉市', '汉'] },
  { name: '西安', code: 'XA', province: '陕西省', region: 'northwest', level: 'new-first-tier', population: 1316, gdp: 11486, alias: ['西安市', '长安'] },
  { name: '苏州', code: 'SZ', province: '江苏省', region: 'east', level: 'new-first-tier', population: 1275, gdp: 23958, alias: ['苏州市'] },
  { name: '郑州', code: 'ZZ', province: '河南省', region: 'central', level: 'new-first-tier', population: 1260, gdp: 12691, alias: ['郑州市'] },
  { name: '南京', code: 'NJ', province: '江苏省', region: 'east', level: 'new-first-tier', population: 942, gdp: 16907, alias: ['南京市', '金陵'] },
  { name: '天津', code: 'TJ', province: '天津市', region: 'north', level: 'new-first-tier', population: 1387, gdp: 15695, alias: ['天津市', '津'] },
  { name: '长沙', code: 'CS', province: '湖南省', region: 'central', level: 'new-first-tier', population: 1005, gdp: 13270, alias: ['长沙市'] },
  { name: '东莞', code: 'DG', province: '广东省', region: 'south', level: 'new-first-tier', population: 1047, gdp: 11200, alias: ['东莞市'] },

  // 二线城市
  { name: '青岛', code: 'QD', province: '山东省', region: 'east', level: 'second-tier', population: 1025, gdp: 14136, alias: ['青岛市'] },
  { name: '大连', code: 'DL', province: '辽宁省', region: 'northeast', level: 'second-tier', population: 745, gdp: 7825, alias: ['大连市'] },
  { name: '宁波', code: 'NB', province: '浙江省', region: 'east', level: 'second-tier', population: 854, gdp: 15704, alias: ['宁波市'] },
  { name: '厦门', code: 'XM', province: '福建省', region: 'south', level: 'second-tier', population: 518, gdp: 7034, alias: ['厦门市', '鹭岛'] },
  { name: '福州', code: 'FZ', province: '福建省', region: 'south', level: 'second-tier', population: 842, gdp: 11324, alias: ['福州市', '榕城'] },
  { name: '无锡', code: 'WX', province: '江苏省', region: 'east', level: 'second-tier', population: 748, gdp: 14850, alias: ['无锡市'] },
  { name: '合肥', code: 'HF', province: '安徽省', region: 'east', level: 'second-tier', population: 946, gdp: 11412, alias: ['合肥市', '庐州'] },
  { name: '昆明', code: 'KM', province: '云南省', region: 'southwest', level: 'second-tier', population: 846, gdp: 7222, alias: ['昆明市', '春城'] },
  { name: '哈尔滨', code: 'HEB', province: '黑龙江省', region: 'northeast', level: 'second-tier', population: 1001, gdp: 5351, alias: ['哈尔滨市', '冰城'] },
  { name: '济南', code: 'JN', province: '山东省', region: 'east', level: 'second-tier', population: 932, gdp: 11432, alias: ['济南市', '泉城'] },
  { name: '佛山', code: 'FS', province: '广东省', region: 'south', level: 'second-tier', population: 955, gdp: 12156, alias: ['佛山市'] },
  { name: '长春', code: 'CC', province: '吉林省', region: 'northeast', level: 'second-tier', population: 906, gdp: 7103, alias: ['长春市'] },
  { name: '温州', code: 'WZ', province: '浙江省', region: 'east', level: 'second-tier', population: 957, gdp: 8029, alias: ['温州市'] },
  { name: '石家庄', code: 'SJZ', province: '河北省', region: 'north', level: 'second-tier', population: 1120, gdp: 6490, alias: ['石家庄市'] },
  { name: '南宁', code: 'NN', province: '广西壮族自治区', region: 'south', level: 'second-tier', population: 874, gdp: 5120, alias: ['南宁市', '绿城'] },
  { name: '常州', code: 'CZ', province: '江苏省', region: 'east', level: 'second-tier', population: 527, gdp: 9550, alias: ['常州市'] },
  { name: '珠海', code: 'ZH', province: '广东省', region: 'south', level: 'second-tier', population: 246, gdp: 3889, alias: ['珠海市'] },
  { name: '泉州', code: 'QZ', province: '福建省', region: 'south', level: 'second-tier', population: 878, gdp: 11304, alias: ['泉州市'] },
  { name: '惠州', code: 'HZ', province: '广东省', region: 'south', level: 'second-tier', population: 606, gdp: 5200, alias: ['惠州市'] },
  { name: '嘉兴', code: 'JX', province: '浙江省', region: 'east', level: 'second-tier', population: 540, gdp: 6355, alias: ['嘉兴市'] },
  { name: '太原', code: 'TY', province: '山西省', region: 'north', level: 'second-tier', population: 534, gdp: 5121, alias: ['太原市'] },
  { name: '南昌', code: 'NC', province: '江西省', region: 'central', level: 'second-tier', population: 658, gdp: 7202, alias: ['南昌市', '洪城'] },
  { name: '贵阳', code: 'GY', province: '贵州省', region: 'southwest', level: 'second-tier', population: 610, gdp: 4711, alias: ['贵阳市', '筑城'] },
  { name: '金华', code: 'JH', province: '浙江省', region: 'east', level: 'second-tier', population: 712, gdp: 5355, alias: ['金华市'] },
  { name: '徐州', code: 'XZ', province: '江苏省', region: 'east', level: 'second-tier', population: 908, gdp: 8457, alias: ['徐州市'] },
  { name: '海口', code: 'HK', province: '海南省', region: 'south', level: 'second-tier', population: 287, gdp: 2057, alias: ['海口市', '椰城'] },
  { name: '乌鲁木齐', code: 'WLMQ', province: '新疆维吾尔自治区', region: 'northwest', level: 'second-tier', population: 405, gdp: 3693, alias: ['乌鲁木齐市'] },
  { name: '绍兴', code: 'SX', province: '浙江省', region: 'east', level: 'second-tier', population: 533, gdp: 6795, alias: ['绍兴市'] },
  { name: '中山', code: 'ZS', province: '广东省', region: 'south', level: 'second-tier', population: 442, gdp: 3566, alias: ['中山市'] },
  { name: '台州', code: 'TZ', province: '浙江省', region: 'east', level: 'second-tier', population: 662, gdp: 5786, alias: ['台州市'] },
  { name: '兰州', code: 'LZ', province: '甘肃省', region: 'northwest', level: 'second-tier', population: 439, gdp: 3231, alias: ['兰州市', '金城'] },

  // 三线城市（部分重要城市）
  { name: '临沂', code: 'LY', province: '山东省', region: 'east', level: 'third-tier', population: 1101, gdp: 5778, alias: ['临沂市'] },
  { name: '潍坊', code: 'WF', province: '山东省', region: 'east', level: 'third-tier', population: 938, gdp: 7010, alias: ['潍坊市'] },
  { name: '保定', code: 'BD', province: '河北省', region: 'north', level: 'third-tier', population: 1155, gdp: 3555, alias: ['保定市'] },
  { name: '镇江', code: 'ZJ', province: '江苏省', region: 'east', level: 'third-tier', population: 320, gdp: 4765, alias: ['镇江市'] },
  { name: '扬州', code: 'YZ', province: '江苏省', region: 'east', level: 'third-tier', population: 455, gdp: 6696, alias: ['扬州市'] },
  { name: '桂林', code: 'GL', province: '广西壮族自治区', region: 'south', level: 'third-tier', population: 492, gdp: 2215, alias: ['桂林市'] },
  { name: '唐山', code: 'TS', province: '河北省', region: 'north', level: 'third-tier', population: 771, gdp: 8230, alias: ['唐山市'] },
  { name: '三亚', code: 'SY', province: '海南省', region: 'south', level: 'third-tier', population: 103, gdp: 695, alias: ['三亚市'] },
  { name: '湖州', code: 'HZ', province: '浙江省', region: 'east', level: 'third-tier', population: 339, gdp: 3644, alias: ['湖州市'] },
  { name: '呼和浩特', code: 'HHHT', province: '内蒙古自治区', region: 'north', level: 'third-tier', population: 349, gdp: 2909, alias: ['呼和浩特市', '呼市'] },
  { name: '廊坊', code: 'LF', province: '河北省', region: 'north', level: 'third-tier', population: 554, gdp: 3553, alias: ['廊坊市'] },
  { name: '洛阳', code: 'LY', province: '河南省', region: 'central', level: 'third-tier', population: 705, gdp: 5445, alias: ['洛阳市', '神都'] },
  { name: '威海', code: 'WH', province: '山东省', region: 'east', level: 'third-tier', population: 290, gdp: 3168, alias: ['威海市'] },
  { name: '盐城', code: 'YC', province: '江苏省', region: 'east', level: 'third-tier', population: 670, gdp: 6617, alias: ['盐城市'] },
  { name: '临汾', code: 'LF', province: '山西省', region: 'north', level: 'third-tier', population: 398, gdp: 1901, alias: ['临汾市'] },
  { name: '江门', code: 'JM', province: '广东省', region: 'south', level: 'third-tier', population: 485, gdp: 3555, alias: ['江门市'] },
  { name: '汕头', code: 'ST', province: '广东省', region: 'south', level: 'third-tier', population: 532, gdp: 2730, alias: ['汕头市'] },
  { name: '泰安', code: 'TA', province: '山东省', region: 'east', level: 'third-tier', population: 547, gdp: 2967, alias: ['泰安市'] },
  { name: '漳州', code: 'ZZ', province: '福建省', region: 'south', level: 'third-tier', population: 522, gdp: 5025, alias: ['漳州市'] },
  { name: '邯郸', code: 'HD', province: '河北省', region: 'north', level: 'third-tier', population: 943, gdp: 4114, alias: ['邯郸市'] },
  { name: '济宁', code: 'JN', province: '山东省', region: 'east', level: 'third-tier', population: 835, gdp: 4406, alias: ['济宁市'] },
  { name: '芜湖', code: 'WH', province: '安徽省', region: 'east', level: 'third-tier', population: 365, gdp: 4302, alias: ['芜湖市'] },
  { name: '淄博', code: 'ZB', province: '山东省', region: 'east', level: 'third-tier', population: 470, gdp: 4402, alias: ['淄博市'] },
  { name: '银川', code: 'YC', province: '宁夏回族自治区', region: 'northwest', level: 'third-tier', population: 285, gdp: 2069, alias: ['银川市'] },
  { name: '柳州', code: 'LZ', province: '广西壮族自治区', region: 'south', level: 'third-tier', population: 416, gdp: 3115, alias: ['柳州市'] },
  { name: '绵阳', code: 'MY', province: '四川省', region: 'southwest', level: 'third-tier', population: 487, gdp: 3350, alias: ['绵阳市'] },
  { name: '湛江', code: 'ZJ', province: '广东省', region: 'south', level: 'third-tier', population: 699, gdp: 3559, alias: ['湛江市'] }
];

// 按级别分组的城市
export const citiesByLevel = {
  'first-tier': citiesData.filter(city => city.level === 'first-tier'),
  'new-first-tier': citiesData.filter(city => city.level === 'new-first-tier'),
  'second-tier': citiesData.filter(city => city.level === 'second-tier'),
  'third-tier': citiesData.filter(city => city.level === 'third-tier'),
  'other': citiesData.filter(city => city.level === 'other')
};

// 按地区分组的城市
export const citiesByRegion = {
  'north': citiesData.filter(city => city.region === 'north'),
  'northeast': citiesData.filter(city => city.region === 'northeast'),
  'east': citiesData.filter(city => city.region === 'east'),
  'south': citiesData.filter(city => city.region === 'south'),
  'southwest': citiesData.filter(city => city.region === 'southwest'),
  'northwest': citiesData.filter(city => city.region === 'northwest'),
  'central': citiesData.filter(city => city.region === 'central')
};

// 热门城市（常用于快速选择）
export const popularCities = [
  '北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安', 
  '南京', '苏州', '天津', '重庆', '郑州', '长沙', '青岛', '大连'
];

// 一线及新一线城市
export const topTierCities = [
  ...citiesByLevel['first-tier'].map(city => city.name),
  ...citiesByLevel['new-first-tier'].map(city => city.name)
];

// 获取所有城市名称
export const getAllCityNames = (): string[] => {
  return citiesData.map(city => city.name);
};

// 获取指定级别的城市名称
export const getCitiesByLevel = (level: CityLevel): string[] => {
  return citiesByLevel[level].map(city => city.name);
};

// 获取指定地区的城市名称
export const getCitiesByRegion = (region: Region): string[] => {
  return citiesByRegion[region].map(city => city.name);
};

// 根据城市名称获取城市详细信息
export const getCityInfo = (cityName: string): CityData | undefined => {
  return citiesData.find(city => 
    city.name === cityName || 
    city.alias?.includes(cityName)
  );
};

// 搜索城市（支持模糊匹配）
export const searchCities = (keyword: string): CityData[] => {
  if (!keyword.trim()) return [];
  
  const searchTerm = keyword.toLowerCase();
  return citiesData.filter(city => 
    city.name.toLowerCase().includes(searchTerm) ||
    city.province.toLowerCase().includes(searchTerm) ||
    city.alias?.some(alias => alias.toLowerCase().includes(searchTerm))
  );
};

// 验证城市是否存在
export const validateCity = (cityName: string): boolean => {
  return citiesData.some(city => 
    city.name === cityName || 
    city.alias?.includes(cityName)
  );
};

// 获取城市级别描述
export const getCityLevelDescription = (level: CityLevel): string => {
  const descriptions = {
    'first-tier': '一线城市',
    'new-first-tier': '新一线城市',
    'second-tier': '二线城市',
    'third-tier': '三线城市',
    'other': '其他城市'
  };
  return descriptions[level];
};

// 获取地区描述
export const getRegionDescription = (region: Region): string => {
  const descriptions = {
    'north': '华北地区',
    'northeast': '东北地区',
    'east': '华东地区',
    'south': '华南地区',
    'southwest': '西南地区',
    'northwest': '西北地区',
    'central': '华中地区'
  };
  return descriptions[region];
};

// 导出城市选择器常用配置
export const citySelectionConfig = {
  // 快速选择选项（热门城市）
  quickOptions: popularCities,
  
  // 分组选项（按级别）
  groupedByLevel: {
    '一线城市': getCitiesByLevel('first-tier'),
    '新一线城市': getCitiesByLevel('new-first-tier'),
    '二线城市': getCitiesByLevel('second-tier'),
    '三线城市': getCitiesByLevel('third-tier')
  },
  
  // 分组选项（按地区）
  groupedByRegion: {
    '华北地区': getCitiesByRegion('north'),
    '东北地区': getCitiesByRegion('northeast'),
    '华东地区': getCitiesByRegion('east'),
    '华南地区': getCitiesByRegion('south'),
    '西南地区': getCitiesByRegion('southwest'),
    '西北地区': getCitiesByRegion('northwest'),
    '华中地区': getCitiesByRegion('central')
  }
};

// 默认导出
export default {
  citiesData,
  popularCities,
  topTierCities,
  getAllCityNames,
  getCitiesByLevel,
  getCitiesByRegion,
  getCityInfo,
  searchCities,
  validateCity,
  getCityLevelDescription,
  getRegionDescription,
  citySelectionConfig
};
