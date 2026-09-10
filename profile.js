/**
 * 所有个人资料集中在这里。双语字段使用 { zh: '中文', en: 'English' }。
 * 数组为空时展示明确的占位状态；填入真实资料后会自动替换。范例见 README.md。
 */
export const profile = {
  name: { zh: '贾振言', en: 'Zhenyan Jia' },
  institution: { zh: '北京理工大学', en: 'Beijing Institute of Technology' },
  intro: { zh: '我是贾振言，来自北京理工大学。', en: 'I’m Zhenyan Jia, at Beijing Institute of Technology.' },
  bio: { zh: '个人简介待补充。', en: 'A personal introduction will be added here.' },
  focus: { zh: '待补充', en: 'To be added' },
  cv: './简历-北理工计算机学院-贾振言.pdf',
  research: [],
  publications: [],
  projects: [],
  experience: [
    {
      period: { zh: '时间待补充', en: 'Dates to be added' },
      institution: { zh: '北京理工大学', en: 'Beijing Institute of Technology' },
      description: { zh: '学位、专业与经历待补充。', en: 'Degree, program, and experience to be added.' },
    },
  ],
  contacts: [
    { label: { zh: 'GitHub', en: 'GitHub' }, detail: '@J3Z2Y9', url: 'https://github.com/J3Z2Y9' },
  ],
};
