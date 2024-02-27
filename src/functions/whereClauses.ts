export function whereClauses(ano: any, mes: any) {
  const whereClauses = [];
  const bindings = [];
  if (mes && ano) {
    whereClauses.push('YEAR(Ocorrencia.DtHr) = ?');
    whereClauses.push('MONTH(Ocorrencia.DtHr) = ?');
    bindings.push(ano, mes);
  }
  return { whereClauses, bindings };
}
