# 薪酬数据集成指南

本文档说明如何将真实的市场薪酬数据集成到ISMT系统中，实现基于最新数据的动态分析。

## 数据源建议

### 1. 公开数据源
- **智联招聘API**: 提供职位发布数据和薪酬统计
- **前程无忧数据**: 行业薪酬报告和趋势分析
- **拉勾网API**: 互联网行业专业数据
- **BOSS直聘数据**: 实时招聘和薪酬信息
- **猎聘网数据**: 中高端人才薪酬数据

### 2. 政府统计数据
- **国家统计局**: 各地区平均工资统计
- **人社部数据**: 就业和薪酬趋势
- **各省市统计局**: 地区性薪酬数据

### 3. 第三方数据服务
- **麦可思数据**: 毕业生就业报告
- **智联招聘研究院**: 行业薪酬白皮书
- **猎聘大数据**: 人才市场报告

## 数据结构标准

### MarketSalaryData 标准格式
```typescript
interface MarketSalaryData {
  // 基础信息
  industry: string;          // 行业分类
  position: string;          // 职位名称
  location: string;          // 城市
  experience: string;        // 工作经验要求
  education: string;         // 学历要求
  
  // 薪酬数据
  salaryRange: {
    min: number;             // 最低薪酬
    max: number;             // 最高薪酬
    median: number;          // 中位数薪酬
    p25: number;             // 25%分位数
    p75: number;             // 75%分位数
  };
  
  // 市场指标
  yearOverYearGrowth: number;  // 同比增长率
  demandIndex: number;         // 需求指数 (1-100)
  competitionIndex: number;    // 竞争指数 (1-100)
  
  // 元数据
  dataSource: string;          // 数据来源
  lastUpdated: string;         // 最后更新时间
}
```

## 数据集成方案

### 方案1: API实时集成
```typescript
// 数据服务类
class SalaryDataService {
  private apiKey: string;
  private baseUrl: string;
  
  constructor(config: DataServiceConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
  }
  
  async fetchMarketData(params: QueryParams): Promise<MarketSalaryData[]> {
    const response = await fetch(`${this.baseUrl}/salary-data`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    
    return response.json();
  }
  
  async fetchIndustryTrends(industry: string): Promise<IndustryTrend[]> {
    // 获取行业趋势数据
  }
}
```

### 方案2: 定期数据同步
```typescript
// 数据同步服务
class DataSyncService {
  private schedule: NodeCron.ScheduleOptions;
  
  constructor() {
    // 每日凌晨2点同步数据
    this.schedule = cron.schedule('0 2 * * *', () => {
      this.syncAllData();
    });
  }
  
  async syncAllData() {
    try {
      // 1. 获取最新薪酬数据
      const salaryData = await this.fetchLatestSalaryData();
      
      // 2. 更新行业趋势
      const trends = await this.fetchIndustryTrends();
      
      // 3. 更新城市系数
      const cityFactors = await this.fetchCityFactors();
      
      // 4. 存储到数据库
      await this.updateDatabase(salaryData, trends, cityFactors);
      
      console.log('数据同步完成');
    } catch (error) {
      console.error('数据同步失败:', error);
    }
  }
}
```

### 方案3: 数据仓库集成
```sql
-- 创建薪酬数据表
CREATE TABLE market_salary_data (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  industry VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  location VARCHAR(50) NOT NULL,
  experience VARCHAR(20) NOT NULL,
  education VARCHAR(20) NOT NULL,
  
  salary_min DECIMAL(10,2) NOT NULL,
  salary_max DECIMAL(10,2) NOT NULL,
  salary_median DECIMAL(10,2) NOT NULL,
  salary_p25 DECIMAL(10,2) NOT NULL,
  salary_p75 DECIMAL(10,2) NOT NULL,
  
  yoy_growth DECIMAL(5,4) NOT NULL,
  demand_index INT NOT NULL,
  competition_index INT NOT NULL,
  
  data_source VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_industry_position (industry, position),
  INDEX idx_location (location),
  INDEX idx_updated_at (updated_at)
);

-- 创建行业趋势表
CREATE TABLE industry_trends (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  industry VARCHAR(100) NOT NULL,
  year INT NOT NULL,
  quarter INT NOT NULL,
  avg_salary_growth DECIMAL(5,4) NOT NULL,
  job_postings INT NOT NULL,
  talent_demand ENUM('high', 'medium', 'low') NOT NULL,
  emerging_skills JSON,
  salary_drivers JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 数据质量保证

### 1. 数据验证规则
```typescript
class DataValidator {
  static validateSalaryData(data: MarketSalaryData): ValidationResult {
    const errors = [];
    
    // 基础字段验证
    if (!data.industry || !data.position || !data.location) {
      errors.push('缺少必填字段');
    }
    
    // 薪酬数据合理性验证
    if (data.salaryRange.min > data.salaryRange.max) {
      errors.push('最低薪酬不能大于最高薪酬');
    }
    
    if (data.salaryRange.median < data.salaryRange.min || 
        data.salaryRange.median > data.salaryRange.max) {
      errors.push('中位数薪酬超出合理范围');
    }
    
    // 市场指标验证
    if (data.demandIndex < 1 || data.demandIndex > 100) {
      errors.push('需求指数必须在1-100之间');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
```

### 2. 数据清洗流程
```typescript
class DataCleaner {
  static cleanSalaryData(rawData: any[]): MarketSalaryData[] {
    return rawData
      .filter(item => this.isValidRecord(item))
      .map(item => this.normalizeRecord(item))
      .filter(item => this.passesQualityCheck(item));
  }
  
  private static normalizeRecord(raw: any): MarketSalaryData {
    return {
      industry: this.normalizeIndustry(raw.industry),
      position: this.normalizePosition(raw.position),
      location: this.normalizeLocation(raw.location),
      experience: this.normalizeExperience(raw.experience),
      education: this.normalizeEducation(raw.education),
      salaryRange: {
        min: Math.round(raw.salaryMin),
        max: Math.round(raw.salaryMax),
        median: Math.round(raw.salaryMedian),
        p25: Math.round(raw.salaryP25),
        p75: Math.round(raw.salaryP75)
      },
      yearOverYearGrowth: parseFloat(raw.yoyGrowth) || 0,
      demandIndex: Math.max(1, Math.min(100, parseInt(raw.demandIndex))),
      competitionIndex: Math.max(1, Math.min(100, parseInt(raw.competitionIndex))),
      dataSource: raw.source || 'unknown',
      lastUpdated: new Date().toISOString().split('T')[0]
    };
  }
}
```

## 实施步骤

### 第一阶段: 基础数据集成
1. **选择主要数据源** (建议: 智联招聘 + 前程无忧)
2. **实现API连接** 
3. **建立数据验证机制**
4. **创建基础数据存储**

### 第二阶段: 数据丰富化
1. **集成多个数据源**
2. **实现数据融合算法**
3. **增加历史趋势分析**
4. **完善城市和行业系数**

### 第三阶段: 智能化升级
1. **实现机器学习预测**
2. **动态调整分析模型**
3. **个性化推荐算法**
4. **实时数据更新**

## 成本估算

### 数据源成本 (月度)
- 智联招聘API: ¥5,000 - ¥15,000
- 前程无忧数据: ¥3,000 - ¥10,000
- 第三方数据服务: ¥2,000 - ¥8,000
- **总计**: ¥10,000 - ¥33,000/月

### 技术成本 (月度)
- 云服务器: ¥2,000 - ¥5,000
- 数据库服务: ¥1,000 - ¥3,000
- CDN和存储: ¥500 - ¥1,500
- **总计**: ¥3,500 - ¥9,500/月

## 注意事项

### 1. 数据合规
- 确保数据使用符合相关法律法规
- 保护用户隐私和数据安全
- 遵守数据源的使用协议

### 2. 数据时效性
- 建立数据更新监控机制
- 设置数据过期提醒
- 实现异常数据告警

### 3. 系统稳定性
- 实现数据源故障切换
- 建立数据备份机制
- 确保服务高可用性

## 联系方式

如需更多技术支持或数据源对接帮助，请联系：
- 技术团队: tech@ismt.com
- 数据团队: data@ismt.com
- 项目经理: pm@ismt.com
