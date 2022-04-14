import { IAxiodInterceptor } from './interfaces.ts';

export const methods = [
  'get',
  'post',
  'put',
  'delete',
  'options',
  'head',
  'connect',
  'trace',
  'patch',
];

export const addInterceptor = <Fullfill = unknown, Rejected = unknown>() => {
  const interceptor: IAxiodInterceptor<Fullfill, Rejected> = {
    list: [],
    use: function (fulfilled, rejected) {
      const id = this.list.length;

      this.list.push({
        fulfilled,
        rejected,
      });

      return id;
    },
    eject: function (index) {
      if (this.list[index]) {
        this.list[index] = null;
      }
    },
  };

  return interceptor;
};
