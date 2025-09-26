/**
 * 面试薪酬谈判助手
 * 提供薪酬谈判技巧和策略，帮你在面试中争取更好待遇
 */

import React, { useState } from 'react';
import { 
  DocumentTextIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlayIcon,
  BookOpenIcon,
  UserIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface NegotiationScenario {
  id: string;
  title: string;
  description: string;
  situation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tips: string[];
  example_responses: string[];
  common_mistakes: string[];
}

interface NegotiationStrategy {
  id: string;
  title: string;
  description: string;
  when_to_use: string;
  steps: string[];
  example: string;
  success_rate: number;
}

interface MockInterview {
  id: string;
  question: string;
  context: string;
  good_answers: string[];
  bad_answers: string[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const InterviewNegotiationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'strategies' | 'scenarios' | 'mock' | 'resources'>('strategies');
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [mockInterviewProgress, setMockInterviewProgress] = useState(0);
  const [currentMockQuestion, setCurrentMockQuestion] = useState<MockInterview | null>(null);

  // 谈判策略数据
  const negotiationStrategies: NegotiationStrategy[] = [
    {
      id: 'anchoring',
      title: '锚定效应策略',
      description: '通过设定一个较高的初始期望值，影响后续谈判的基准点',
      when_to_use: '当你有充分的市场调研数据支持时，在薪酬讨论的开始阶段使用',
      steps: [
        '提前调研该职位的市场薪酬范围',
        '准备充分的数据支持你的期望薪酬',
        '在合适的时机提出略高于期望的数字',
        '解释这个数字的合理性和依据',
        '保持开放态度，愿意进行讨论'
      ],
      example: '"根据我对市场的调研，这个职位在北京的薪酬范围是25-35K，考虑到我的经验和技能，我期望的薪酬是32K左右。"',
      success_rate: 75
    },
    {
      id: 'value_demonstration',
      title: '价值展示策略',
      description: '通过具体的成果和贡献来证明你的价值，为更高薪酬提供依据',
      when_to_use: '当你有丰富的项目经验和可量化的成果时使用',
      steps: [
        '准备3-5个具体的成功案例',
        '量化你的贡献和影响',
        '将成果与业务价值联系起来',
        '展示你能为新公司带来的价值',
        '基于价值提出合理的薪酬期望'
      ],
      example: '"在上一家公司，我负责的项目为公司节省了200万成本，提升了30%的效率。我相信我能为贵公司带来类似的价值。"',
      success_rate: 82
    },
    {
      id: 'package_negotiation',
      title: '整体薪酬包策略',
      description: '不仅关注基础薪资，还要考虑奖金、股权、福利等整体薪酬包',
      when_to_use: '当基础薪资谈判空间有限时，可以从其他方面争取更好的待遇',
      steps: [
        '了解公司的完整薪酬结构',
        '评估各项福利的实际价值',
        '找出最有谈判空间的部分',
        '提出创造性的薪酬组合方案',
        '确保总价值符合你的期望'
      ],
      example: '"如果基础薪资暂时无法调整，我们可以考虑在年终奖金或股权激励方面有所倾斜吗？"',
      success_rate: 68
    },
    {
      id: 'timing_strategy',
      title: '时机把握策略',
      description: '选择合适的时机进行薪酬谈判，提高成功概率',
      when_to_use: '在整个面试流程中，需要准确把握谈判的最佳时机',
      steps: [
        '在初期面试中避免过早谈论薪酬',
        '等到公司表现出强烈兴趣后再谈',
        '收到offer后是最佳谈判时机',
        '给自己留出充分的考虑时间',
        '保持专业和礼貌的态度'
      ],
      example: '"我对这个职位很感兴趣，希望能先了解更多工作内容。关于薪酬，我们可以在后续详细讨论。"',
      success_rate: 71
    },
    {
      id: 'alternative_leverage',
      title: '替代选择策略',
      description: '通过展示你有其他选择来增强谈判筹码',
      when_to_use: '当你确实有其他offer或机会时，谨慎使用以增强谈判地位',
      steps: [
        '确保你确实有其他可行的选择',
        '不要虚张声势或编造信息',
        '以积极的方式提及其他机会',
        '强调你对当前机会的兴趣',
        '给公司合理的决策时间'
      ],
      example: '"我对贵公司的职位很感兴趣，同时也在考虑其他几个机会。希望我们能找到双方都满意的方案。"',
      success_rate: 79
    }
  ];

  // 谈判场景数据
  const negotiationScenarios: NegotiationScenario[] = [
    {
      id: 'first_job',
      title: '应届生首份工作',
      description: '作为应届毕业生，如何在缺乏经验的情况下进行薪酬谈判',
      situation: '你是一名刚毕业的计算机专业学生，收到了一家互联网公司的offer，但薪酬低于预期。',
      difficulty: 'beginner',
      tips: [
        '重点强调你的学习能力和潜力',
        '展示在校期间的项目经验和实习成果',
        '表现出对公司和行业的热情',
        '可以提及同学或朋友的薪酬水平作为参考',
        '保持谦逊但不要过分贬低自己'
      ],
      example_responses: [
        '"虽然我是应届生，但我在实习期间独立完成了用户量10万+的项目，我相信我能快速为团队创造价值。"',
        '"我对贵公司的技术栈很感兴趣，也做了充分的学习准备。根据我了解的市场情况，这个岗位的起薪一般在12-15K。"',
        '"我希望能有一个与我能力和市场水平相匹配的起薪，这样我能更专注地投入工作。"'
      ],
      common_mistakes: [
        '过分强调自己是新手，缺乏自信',
        '没有做市场调研就提出薪酬要求',
        '只关注薪资，忽略了成长机会',
        '态度过于强硬或者过于被动'
      ]
    },
    {
      id: 'job_hopping',
      title: '跳槽涨薪谈判',
      description: '在跳槽过程中，如何基于现有薪酬争取更好的待遇',
      situation: '你有3年工作经验，当前月薪20K，希望通过跳槽实现薪酬的显著提升。',
      difficulty: 'intermediate',
      tips: [
        '明确说明跳槽的动机和期望',
        '展示你在当前公司的成长和成就',
        '合理设定薪酬涨幅期望（通常20-30%）',
        '准备解释为什么值得这个涨幅',
        '考虑整体职业发展，不只是薪酬'
      ],
      example_responses: [
        '"在现在的公司我学到了很多，月薪也从15K涨到了20K。我希望这次跳槽能有25-30%的涨幅。"',
        '"我之所以考虑新机会，主要是希望在更大的平台上发挥价值，同时获得与市场水平相匹配的薪酬。"',
        '"基于我的经验和能力，以及对这个职位的了解，我期望的薪酬范围是25-28K。"'
      ],
      common_mistakes: [
        '期望涨幅过高，超出合理范围',
        '只强调想要涨薪，没有展示价值',
        '对现公司过度抱怨',
        '没有考虑其他福利和发展机会'
      ]
    },
    {
      id: 'senior_position',
      title: '高级职位谈判',
      description: '申请管理或高级技术岗位时的薪酬谈判策略',
      situation: '你有8年经验，申请技术总监职位，需要谈判包括股权在内的整体薪酬包。',
      difficulty: 'advanced',
      tips: [
        '重点展示领导力和战略思维',
        '准备详细的工作规划和目标',
        '讨论整体薪酬包，不只是基础薪资',
        '展示你对公司业务的深度理解',
        '表现出长期合作的意愿'
      ],
      example_responses: [
        '"作为技术总监，我会关注技术架构的长期规划。基于这个职位的责任和市场水平，我期望的年薪在80-100万。"',
        '"我希望薪酬结构能体现长期激励，比如股权或期权，这样我能更好地与公司利益绑定。"',
        '"我带过30人的技术团队，帮助公司实现了3倍的业务增长。我相信我能为贵公司带来类似的价值。"'
      ],
      common_mistakes: [
        '过分关注短期收益，忽略长期价值',
        '没有展示足够的战略思维',
        '对股权等复杂薪酬结构了解不足',
        '缺乏对公司业务的深入理解'
      ]
    }
  ];

  // 模拟面试问题
  const mockInterviews: MockInterview[] = [
    {
      id: 'salary_expectation',
      question: '你的薪资期望是多少？',
      context: '这是面试中最常见的问题，需要既不过高也不过低地回答',
      difficulty: 'medium',
      good_answers: [
        '根据我对这个职位和市场的了解，我期望的薪资范围是X-Y，但我更关心这个机会的发展前景。',
        '我希望薪资能够反映我的能力和经验。基于我的调研，这个职位的市场范围是X-Y。',
        '薪资对我很重要，但我更看重工作内容和团队。我们可以根据具体的工作要求来讨论合适的薪资。'
      ],
      bad_answers: [
        '我没有特别的要求，你们看着给就行。',
        '我现在月薪X，你们至少要给我X+5K。',
        '钱不是最重要的，我主要是为了学习。'
      ],
      explanation: '好的回答显示了你做过市场调研，有合理的期望，同时保持灵活性。避免过于被动或过于强硬。'
    },
    {
      id: 'current_salary',
      question: '你目前的薪资是多少？',
      context: '这个问题可能会影响公司的offer，需要诚实但策略性地回答',
      difficulty: 'hard',
      good_answers: [
        '我目前的基础薪资是X，加上奖金和福利，总包大约是Y。我更关心这个新职位能提供的价值和发展机会。',
        '我目前的薪酬包括基本工资X和其他福利。我希望新的机会能在薪酬和职业发展上都有所提升。',
        '我可以分享我目前的薪酬信息，但我更希望基于这个职位的价值和我能带来的贡献来讨论薪资。'
      ],
      bad_answers: [
        '这是隐私，我不方便透露。',
        '我现在薪资很低，所以希望你们能给高一点。',
        '我现在拿X，但我觉得我值更多钱。'
      ],
      explanation: '诚实透明是最好的策略，同时要引导话题转向价值创造和职位本身的价值。'
    },
    {
      id: 'negotiation_response',
      question: '我们的预算有限，只能提供X薪资，你觉得如何？',
      context: '当公司的offer低于期望时，如何进行后续谈判',
      difficulty: 'hard',
      good_answers: [
        '我理解预算的限制。除了基础薪资，我们可以考虑其他形式的补偿吗？比如奖金、股权或福利？',
        '我很感兴趣这个机会。如果基础薪资暂时无法调整，我们能否在试用期后重新评估？',
        '我希望我们能找到双方都满意的方案。可以详细了解一下整体的薪酬包吗？'
      ],
      bad_answers: [
        '这太低了，我不能接受。',
        '好吧，那就这样吧。',
        '你们这样的大公司应该不差钱吧？'
      ],
      explanation: '保持积极态度，寻找创造性的解决方案，避免直接拒绝或立即妥协。'
    }
  ];

  const tabs = [
    { id: 'strategies', label: '谈判策略', icon: LightBulbIcon },
    { id: 'scenarios', label: '场景指导', icon: BookOpenIcon },
    { id: 'mock', label: '模拟练习', icon: ChatBubbleLeftRightIcon },
    { id: 'resources', label: '资源工具', icon: DocumentTextIcon }
  ];

  const startMockInterview = () => {
    setCurrentMockQuestion(mockInterviews[0]);
    setMockInterviewProgress(0);
  };

  const nextMockQuestion = () => {
    const nextIndex = mockInterviewProgress + 1;
    if (nextIndex < mockInterviews.length) {
      setCurrentMockQuestion(mockInterviews[nextIndex]);
      setMockInterviewProgress(nextIndex);
    } else {
      setCurrentMockQuestion(null);
      setMockInterviewProgress(0);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container max-w-7xl py-12">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl">
            <DocumentTextIcon className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-dsp-dark">面试薪酬谈判助手</h1>
            <p className="text-dsp-gray mt-1">掌握谈判技巧，在面试中争取更好待遇</p>
          </div>
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
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-dsp-gray hover:text-dsp-dark'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 内容区域 */}
        {activeTab === 'strategies' && (
          <StrategiesView 
            strategies={negotiationStrategies}
            selectedStrategy={selectedStrategy}
            onSelectStrategy={setSelectedStrategy}
          />
        )}
        
        {activeTab === 'scenarios' && (
          <ScenariosView scenarios={negotiationScenarios} />
        )}
        
        {activeTab === 'mock' && (
          <MockInterviewView 
            questions={mockInterviews}
            currentQuestion={currentMockQuestion}
            progress={mockInterviewProgress}
            onStart={startMockInterview}
            onNext={nextMockQuestion}
          />
        )}
        
        {activeTab === 'resources' && (
          <ResourcesView />
        )}
      </div>
    </div>
  );
};

// 谈判策略视图
const StrategiesView: React.FC<{
  strategies: NegotiationStrategy[];
  selectedStrategy: string | null;
  onSelectStrategy: (id: string | null) => void;
}> = ({ strategies, selectedStrategy, onSelectStrategy }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {strategies.map((strategy) => (
          <div
            key={strategy.id}
            className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${
              selectedStrategy === strategy.id
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 hover:border-red-300 bg-white'
            }`}
            onClick={() => onSelectStrategy(selectedStrategy === strategy.id ? null : strategy.id)}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-dsp-dark">{strategy.title}</h3>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">{strategy.success_rate}%</div>
                  <div className="text-xs text-dsp-gray">成功率</div>
                </div>
              </div>

              <p className="text-sm text-dsp-gray">{strategy.description}</p>

              <div className="space-y-2">
                <div className="text-sm font-medium text-dsp-dark">适用场景</div>
                <p className="text-xs text-dsp-gray">{strategy.when_to_use}</p>
              </div>

              {selectedStrategy === strategy.id && (
                <div className="pt-4 border-t border-red-200 space-y-4">
                  <div>
                    <h4 className="font-medium text-dsp-dark mb-2">实施步骤</h4>
                    <ol className="text-sm space-y-1">
                      {strategy.steps.map((step, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="flex items-center justify-center w-5 h-5 bg-red-100 text-red-600 text-xs rounded-full font-semibold flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-dsp-gray">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-medium text-dsp-dark mb-2">示例表达</h4>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-dsp-dark italic">"{strategy.example}"</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 场景指导视图
const ScenariosView: React.FC<{ scenarios: NegotiationScenario[] }> = ({ scenarios }) => {
  return (
    <div className="space-y-8">
      {scenarios.map((scenario) => (
        <div key={scenario.id} className="bg-white border border-gray-200 rounded-2xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-dsp-dark mb-2">{scenario.title}</h3>
              <p className="text-dsp-gray">{scenario.description}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              scenario.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
              scenario.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {scenario.difficulty === 'beginner' ? '初级' :
               scenario.difficulty === 'intermediate' ? '中级' : '高级'}
            </div>
          </div>

          <div className="space-y-6">
            {/* 场景描述 */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-dsp-dark mb-2">场景设定</h4>
              <p className="text-dsp-dark">{scenario.situation}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 谈判技巧 */}
              <div className="space-y-4">
                <h4 className="font-medium text-dsp-dark flex items-center">
                  <LightBulbIcon className="w-5 h-5 text-yellow-500 mr-2" />
                  谈判技巧
                </h4>
                <ul className="space-y-2">
                  {scenario.tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-dsp-gray">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 常见错误 */}
              <div className="space-y-4">
                <h4 className="font-medium text-dsp-dark flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
                  常见错误
                </h4>
                <ul className="space-y-2">
                  {scenario.common_mistakes.map((mistake, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <ExclamationTriangleIcon className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-dsp-gray">{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 示例回答 */}
            <div className="space-y-4">
              <h4 className="font-medium text-dsp-dark">推荐表达方式</h4>
              <div className="space-y-3">
                {scenario.example_responses.map((response, index) => (
                  <div key={index} className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <p className="text-dsp-dark italic">"{response}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// 模拟面试视图
const MockInterviewView: React.FC<{
  questions: MockInterview[];
  currentQuestion: MockInterview | null;
  progress: number;
  onStart: () => void;
  onNext: () => void;
}> = ({ questions, currentQuestion, progress, onStart, onNext }) => {
  if (!currentQuestion) {
    return (
      <div className="text-center py-20">
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="p-4 bg-red-100 rounded-2xl">
              <PlayIcon className="w-12 h-12 text-red-600" />
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold text-dsp-dark mb-2">薪酬谈判模拟面试</h3>
            <p className="text-dsp-gray max-w-md mx-auto">
              通过模拟真实的面试场景，练习你的薪酬谈判技巧
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md mx-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-dsp-gray">题目数量</span>
                <span className="font-semibold text-dsp-dark">{questions.length} 道</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-dsp-gray">预计用时</span>
                <span className="font-semibold text-dsp-dark">15-20 分钟</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-dsp-gray">难度等级</span>
                <span className="font-semibold text-dsp-dark">初级 → 高级</span>
              </div>
            </div>
          </div>

          <button
            onClick={onStart}
            className="px-8 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
          >
            开始模拟面试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 进度条 */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-dsp-gray">进度</span>
          <span className="text-dsp-dark">{progress + 1} / {questions.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-red-600 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${((progress + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* 当前问题 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <div className="space-y-6">
          {/* 问题头部 */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-dsp-dark mb-2">{currentQuestion.question}</h3>
              <p className="text-dsp-gray">{currentQuestion.context}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
              currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {currentQuestion.difficulty === 'easy' ? '简单' :
               currentQuestion.difficulty === 'medium' ? '中等' : '困难'}
            </div>
          </div>

          {/* 好的回答示例 */}
          <div className="space-y-4">
            <h4 className="font-medium text-dsp-dark flex items-center">
              <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
              推荐回答
            </h4>
            <div className="space-y-3">
              {currentQuestion.good_answers.map((answer, index) => (
                <div key={index} className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <p className="text-dsp-dark">{answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 不好的回答示例 */}
          <div className="space-y-4">
            <h4 className="font-medium text-dsp-dark flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
              避免这样回答
            </h4>
            <div className="space-y-3">
              {currentQuestion.bad_answers.map((answer, index) => (
                <div key={index} className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <p className="text-dsp-dark">{answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 解释说明 */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-dsp-dark mb-2">解释说明</h4>
            <p className="text-dsp-dark">{currentQuestion.explanation}</p>
          </div>

          {/* 下一题按钮 */}
          <div className="flex justify-end">
            <button
              onClick={onNext}
              className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              {progress + 1 < questions.length ? '下一题' : '完成练习'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 资源工具视图
const ResourcesView: React.FC = () => {
  const resources = [
    {
      category: '薪酬调研工具',
      items: [
        { name: '拉勾薪酬报告', description: '互联网行业薪酬数据', url: '#' },
        { name: 'BOSS直聘薪酬指数', description: '各行业薪酬趋势', url: '#' },
        { name: '猎聘薪酬白皮书', description: '中高端人才薪酬报告', url: '#' }
      ]
    },
    {
      category: '谈判技巧书籍',
      items: [
        { name: '《谈判力》', description: '哈佛谈判项目经典教材', url: '#' },
        { name: '《关键对话》', description: '如何进行高效沟通', url: '#' },
        { name: '《影响力》', description: '说服他人的心理学原理', url: '#' }
      ]
    },
    {
      category: '面试准备',
      items: [
        { name: '薪酬谈判话术模板', description: '常用谈判表达方式', url: '#' },
        { name: '面试问题清单', description: '薪酬相关面试问题汇总', url: '#' },
        { name: 'Offer评估表', description: '全面评估工作机会', url: '#' }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {resources.map((category) => (
        <div key={category.category} className="bg-white border border-gray-200 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-dsp-dark mb-6">{category.category}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {category.items.map((item) => (
              <div key={item.name} className="p-4 border border-gray-200 rounded-lg hover:border-red-200 hover:shadow-md transition-all">
                <h4 className="font-medium text-dsp-dark mb-2">{item.name}</h4>
                <p className="text-sm text-dsp-gray mb-4">{item.description}</p>
                <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                  查看详情 →
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* 实用小贴士 */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-dsp-dark mb-6 flex items-center">
          <LightBulbIcon className="w-6 h-6 text-red-600 mr-2" />
          薪酬谈判实用小贴士
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-dsp-dark">谈判前准备</h4>
            <ul className="space-y-2 text-sm text-dsp-gray">
              <li>• 充分调研目标职位的市场薪酬范围</li>
              <li>• 准备3-5个具体的成功案例</li>
              <li>• 了解公司的薪酬结构和福利政策</li>
              <li>• 设定合理的薪酬期望范围</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-dsp-dark">谈判中注意</h4>
            <ul className="space-y-2 text-sm text-dsp-gray">
              <li>• 保持积极和专业的态度</li>
              <li>• 重点强调你能创造的价值</li>
              <li>• 考虑整体薪酬包，不只是基础薪资</li>
              <li>• 给自己和公司留出考虑时间</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
