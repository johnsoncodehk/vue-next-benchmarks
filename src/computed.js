function go() {
  const { ref, computed, watch, watchEffect } = Vue;

  const suite = new Benchmark.Suite();

  bench(() => {
    return suite.add("create computed", () => {
      const c = computed(() => 100);
    });
  });

  bench(() => {
    let i = 0;
    const o = ref(100);
    return suite.add("write independent ref dep", () => {
      o.value = i++;
    });
  });

  bench(() => {
    const v = ref(100);
    const c = computed(() => {
      return v.value * 2
    });
    let i = 0;
    return suite.add("write ref, don't read computed (never invoked)", () => {
      v.value = i++;
    });
  })

  bench(() => {
    const v = ref(100);
    const c = computed(() => {
      return v.value * 2
    });
    const cv = c.value;
    let i = 0;
    return suite.add("write ref, don't read computed (invoked)", () => {
      v.value = i++;
    });
  })

  bench(() => {
    const v = ref(100);
    const c = computed(() => {
      return v.value * 2
    });
    let i = 0;
    return suite.add("write ref, read computed", () => {
      v.value = i++;
      const cv = c.value;
    });
  });


  bench(() => {
    const v = ref(100);
    const computeds = [];
    for (let i = 0, n = 1000; i < n; i++) {
      const c = computed(() => {
        return v.value * 2
      });
      computeds.push(c);
    }
    let i = 0;
    return suite.add("write ref, don't read 1000 computeds (never invoked)", () => {
      v.value = i++;
    });
  })

  bench(() => {
    const v = ref(100);
    const computeds = [];
    for (let i = 0, n = 1000; i < n; i++) {
      const c = computed(() => {
        return v.value * 2
      });
      const cv = c.value;
      computeds.push(c);
    }
    let i = 0;
    return suite.add("write ref, don't read 1000 computeds (invoked)", () => {
      v.value = i++;
    });
  });

  bench(() => {
    const v = ref(100);
    const computeds = [];
    for (let i = 0, n = 1000; i < n; i++) {
      const c = computed(() => {
        return v.value * 2
      });
      const cv = c.value;
      computeds.push(c);
    }
    let i = 0;
    return suite.add("write ref, read 1000 computeds", () => {
      v.value = i++;
      computeds.forEach(c => c.value);
    });
  });

  bench(() => {
    const v = ref(100);
    const computeds = [computed(() => v.value + 1)];
    for (let i = 0, n = 999; i < n; i++) {
      const c0 = computeds[computeds.length - 1];
      const c = computed(() => {
        return c0.value + 1
      });
      const cv = c.value;
      computeds.push(c);
    }
    let i = 0;
    return suite.add("write ref, read 1000 chain computeds (don't get value)", () => {
      v.value = i++;
    });
  });

  bench(() => {
    const v = ref(100);
    const computeds = [computed(() => v.value + 1)];
    for (let i = 0, n = 999; i < n; i++) {
      const c0 = computeds[computeds.length - 1];
      const c = computed(() => {
        return c0.value + 1
      });
      const cv = c.value;
      computeds.push(c);
    }
    let i = 0;
    return suite.add("write ref, read 1000 chain computeds (get value)", () => {
      v.value = i++;
      computeds[computeds.length - 1].value
    });
  });

  bench(() => {
    const v = ref(100);
    const computeds = [computed(() => v.value % 2)];
    for (let i = 0, n = 999; i < n; i++) {
      const c0 = computeds[computeds.length - 1];
      const c = computed(() => {
        return c0.value % 2
      });
      const cv = c.value;
      computeds.push(c);
    }
    let i = 0;
    return suite.add("write ref, read 1000 chain computeds (don't get value, no dirty)", () => {
      i += 2;
      v.value = i;
    });
  });

  bench(() => {
    const v = ref(100);
    const computeds = [computed(() => v.value % 2)];
    for (let i = 0, n = 999; i < n; i++) {
      const c0 = computeds[computeds.length - 1];
      const c = computed(() => {
        return c0.value % 2
      });
      const cv = c.value;
      computeds.push(c);
    }
    let i = 0;
    return suite.add("write ref, read 1000 chain computeds (get value, no dirty)", () => {
      i += 2;
      v.value = i;
      computeds[computeds.length - 1].value
    });
  });

  bench(() => {
    const refs = [];
    for (let i = 0, n = 1000; i < n; i++) {
      refs.push(ref(i));
    }
    const c = computed(() => {
      let total = 0;
      refs.forEach(ref => total += ref.value);
      return total;
    });
    let i = 0;
    const n = refs.length;
    return suite.add("1000 refs, 1 computed", () => {
      refs[i++ % n].value++;
      const v = c.value;
    });
  });

  return suite;
}