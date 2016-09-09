import identity from 'lodash/identity';
import restart from '../restart';

const chalk = {
  yellow: identity,
  green: identity
};

const prc = {
  stdin: {
    setEncoding: identity
  },
  stdout: {
    write: identity
  }
};

test('should call server.invalidate if rs in stdin', done => {
  prc.stdin.read = () => 'rs';
  prc.stdin.on = (event, cb) => cb();

  restart({
    prc,
    chalk,
    server: {
      invalidate() {
        done();
      }
    }
  });
});

test('should not call server.invalidate if something else in stdin', done => {
  let invalidate = false;

  prc.stdin.read = () => '';
  prc.stdin.on = (event, cb) => {
    cb();
    expect(invalidate).not.toBe(true);
    done();
  };

  restart({
    prc,
    chalk,
    server: {
      invalidate() {
        invalidate = true;
      }
    }
  });
});
