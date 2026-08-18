import doctors from '../data/doctors.json';

/**
 * 诊所很小，一个医生可以同时看几个科室。
 * `department` 是主科室，决定他个人资料页的地址；`alsoIn` 是兼属科室，
 * 只影响他会出现在哪几个科室名单里。两者都要算进科室成员。
 */
export const departmentOrder = [
  'general',
  'respiratory',
  'endocrine',
  'genetics',
  'surgery',
  'neuro',
  'psychology',
];

export function doctorsInDept(deptId: string) {
  return doctors.filter((d) => d.department === deptId || d.alsoIn.includes(deptId));
}

/** 科室中文名以「主科室是它的第一位医生」为准，避免再维护一份对照表。 */
export function deptTitleZh(deptId: string) {
  const primary = doctors.find((d) => d.department === deptId);
  return primary?.departmentTitle || deptId;
}

/** 有成员的科室，按固定顺序排列。 */
export function activeDepartments() {
  return departmentOrder
    .map((id) => ({ id, doctors: doctorsInDept(id) }))
    .filter((g) => g.doctors.length > 0);
}
