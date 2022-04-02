export async function getPaginationType(
  orderBy: any,
): Promise<{ order: any; column: any }> {
  let column = '';
  let order = '';

  if (orderBy == undefined) {
    column = 'id';
    order = 'desc';
  } else {
    order = orderBy[0]?.order;
    column = orderBy[0]?.column;
  }
  return { order, column };
}
