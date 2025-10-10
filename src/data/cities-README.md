# 城市数据模块使用说明

## 概述
`cities.ts` 提供了中国主要城市的完整数据，包括城市级别、地理区域、人口、GDP等信息，供各功能模块统一调用。

## 数据结构

### CityData 接口
```typescript
interface CityData {
  name: string;           // 城市名称
  code: string;          // 城市代码
  province: string;      // 所属省份
  region: Region;        // 地理区域
  level: CityLevel;      // 城市级别
  population?: number;   // 人口数量（万人）
  gdp?: number;         // GDP（亿元）
  alias?: string[];     // 别名
}
```

### 城市级别 (CityLevel)
- `first-tier`: 一线城市（北京、上海、广州、深圳）
- `new-first-tier`: 新一线城市（成都、重庆、杭州等）
- `second-tier`: 二线城市
- `third-tier`: 三线城市
- `other`: 其他城市

### 地理区域 (Region)
- `north`: 华北地区
- `northeast`: 东北地区
- `east`: 华东地区
- `south`: 华南地区
- `southwest`: 西南地区
- `northwest`: 西北地区
- `central`: 华中地区

## 主要导出

### 基础数据
```typescript
import { 
  citiesData,           // 完整城市数据数组
  popularCities,        // 热门城市名称数组（16个常用城市）
  topTierCities         // 一线+新一线城市名称数组
} from '@/data/cities';
```

### 按分类获取城市
```typescript
import { 
  citiesByLevel,        // 按城市级别分组
  citiesByRegion        // 按地理区域分组
} from '@/data/cities';

// 获取一线城市
const firstTierCities = citiesByLevel['first-tier'];

// 获取华东地区城市
const eastCities = citiesByRegion['east'];
```

### 实用函数
```typescript
import {
  getAllCityNames,      // 获取所有城市名称
  getCitiesByLevel,     // 获取指定级别的城市名称
  getCitiesByRegion,    // 获取指定地区的城市名称
  getCityInfo,          // 根据城市名称获取详细信息
  searchCities,         // 搜索城市（支持模糊匹配）
  validateCity          // 验证城市是否存在
} from '@/data/cities';
```

## 使用示例

### 1. 基础下拉选择器
```tsx
import { popularCities } from '@/data/cities';

const CitySelector = () => (
  <select>
    <option value="">请选择城市</option>
    {popularCities.map(city => (
      <option key={city} value={city}>{city}</option>
    ))}
  </select>
);
```

### 2. 分组选择器
```tsx
import { citySelectionConfig } from '@/data/cities';

const GroupedCitySelector = () => (
  <select>
    <option value="">请选择城市</option>
    {Object.entries(citySelectionConfig.groupedByLevel).map(([levelName, cities]) => (
      <optgroup key={levelName} label={levelName}>
        {cities.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </optgroup>
    ))}
  </select>
);
```

### 3. 自动完成输入框
```tsx
import { popularCities } from '@/data/cities';

const CityAutocomplete = () => (
  <input
    type="text"
    list="city-suggestions"
    placeholder="请输入城市名称"
  />
  <datalist id="city-suggestions">
    {popularCities.map(city => (
      <option key={city} value={city} />
    ))}
  </datalist>
);
```

### 4. 城市搜索
```tsx
import { searchCities } from '@/data/cities';

const searchResults = searchCities('北'); // 搜索包含"北"的城市
// 结果: [{ name: '北京', ... }]
```

### 5. 城市信息获取
```tsx
import { getCityInfo } from '@/data/cities';

const cityInfo = getCityInfo('北京');
console.log(cityInfo);
// 输出: { name: '北京', level: 'first-tier', region: 'north', ... }
```

### 6. 城市验证
```tsx
import { validateCity } from '@/data/cities';

const isValid = validateCity('北京'); // true
const isInvalid = validateCity('火星市'); // false
```

## 快速配置

### citySelectionConfig
提供了预配置的城市选择器配置：

```typescript
import { citySelectionConfig } from '@/data/cities';

// 快速选择选项（热门城市）
citySelectionConfig.quickOptions

// 按级别分组
citySelectionConfig.groupedByLevel

// 按地区分组
citySelectionConfig.groupedByRegion
```

## 数据统计

- **总城市数量**: 70+ 个主要城市
- **一线城市**: 4个（北京、上海、广州、深圳）
- **新一线城市**: 11个（成都、重庆、杭州、武汉等）
- **二线城市**: 30+ 个
- **三线城市**: 25+ 个
- **覆盖地区**: 全国7大地理区域

## 已集成页面

1. **薪酬计算器** (`SalaryCalculatorPage.tsx`)
2. **薪酬查询** (`SalaryQueryPage.tsx`)
3. **薪酬监控** (`SalaryMonitoringPage.tsx`)
4. **智能招聘** (`RecruitmentPage.tsx`)
5. **智能JD写作** (`SmartJDWriterPage.tsx`)

## 扩展指南

### 添加新城市
1. 在 `citiesData` 数组中添加新的城市数据
2. 确保包含必要的字段：`name`, `code`, `province`, `region`, `level`
3. 可选字段：`population`, `gdp`, `alias`

### 修改热门城市列表
修改 `popularCities` 数组，调整在快速选择中显示的城市。

### 添加新的城市分类
1. 扩展 `CityLevel` 或 `Region` 类型
2. 更新相应的分组逻辑
3. 添加对应的描述函数

## 注意事项

- 所有城市数据基于最新的行政区划和统计数据
- 人口和GDP数据仅供参考，实际数值可能有所变化
- 支持城市别名搜索（如：北京市、京）
- 所有函数都包含输入验证，避免空值错误
- 数据结构支持动态扩展，便于后续维护
