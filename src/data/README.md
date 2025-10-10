# 数据模块使用说明

## 职业分类数据 (jobCategories.ts)

### 概述
`jobCategories.ts` 提供了完整的职业分类数据，采用三级分类体系：行业 → 分类 → 具体职位。

### 数据结构
```typescript
interface JobCategoryData {
  [industry: string]: {
    [category: string]: string[];
  };
}
```

### 主要功能

#### 1. 获取所有行业
```typescript
import { getIndustries } from '@/data/jobCategories';

const industries = getIndustries();
// 返回: ['互联网/AI', '电子/电气/通信', '产品', ...]
```

#### 2. 获取指定行业的分类
```typescript
import { getCategories } from '@/data/jobCategories';

const categories = getCategories('互联网/AI');
// 返回: ['后端开发', '前端/移动开发', '测试', ...]
```

#### 3. 获取具体职位
```typescript
import { getPositions } from '@/data/jobCategories';

const positions = getPositions('互联网/AI', '前端/移动开发');
// 返回: ['前端开发工程师', 'Android', 'iOS', ...]
```

#### 4. 职位搜索
```typescript
import { searchPositions } from '@/data/jobCategories';

const results = searchPositions('前端');
// 返回匹配的职位数组，包含行业、分类、职位信息
```

#### 5. 验证职位路径
```typescript
import { validateJobPath } from '@/data/jobCategories';

const isValid = validateJobPath('互联网/AI', '前端/移动开发', '前端开发工程师');
// 返回: true/false
```

#### 6. 获取职位路径描述
```typescript
import { getJobPathDescription } from '@/data/jobCategories';

const description = getJobPathDescription('互联网/AI', '前端/移动开发', '前端开发工程师');
// 返回: "互联网/AI > 前端/移动开发 > 前端开发工程师"
```

### 使用示例

#### 在表单中使用三级选择
```tsx
import { getIndustries, getCategories, getPositions } from '@/data/jobCategories';

const JobSelector = () => {
  const [industry, setIndustry] = useState('');
  const [category, setCategory] = useState('');
  const [position, setPosition] = useState('');

  return (
    <div>
      {/* 行业选择 */}
      <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
        <option value="">请选择行业</option>
        {getIndustries().map(ind => (
          <option key={ind} value={ind}>{ind}</option>
        ))}
      </select>

      {/* 分类选择 */}
      <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={!industry}>
        <option value="">请选择分类</option>
        {getCategories(industry).map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* 职位选择 */}
      <select value={position} onChange={(e) => setPosition(e.target.value)} disabled={!category}>
        <option value="">请选择职位</option>
        {getPositions(industry, category).map(pos => (
          <option key={pos} value={pos}>{pos}</option>
        ))}
      </select>
    </div>
  );
};
```

### 已集成的页面
- `src/pages/QueryPage.tsx` - 薪酬查询页面
- `src/pages/jobseeker/SalaryCalculatorPage.tsx` - 薪酬计算器
- `src/pages/hr/SmartJDWriterPage.tsx` - 智能JD写作助手
- `src/pages/hr/BatchJDGeneratorPage.tsx` - 批量JD生成器

### 扩展指南
如需添加新的行业或职位：
1. 在 `jobCategories` 对象中添加相应数据
2. 保持三级分类结构
3. 确保数据的一致性和完整性

### 注意事项
- 所有函数都包含输入验证
- 空值或无效输入会返回空数组或false
- 搜索功能支持模糊匹配（不区分大小写）
- 数据结构支持动态扩展
