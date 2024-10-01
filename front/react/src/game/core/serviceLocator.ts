export class ServiceLocator {
    private static instances: Map<string, any> = new Map();
  
    static register<T>(key: string, instance: T): void {
      this.instances.set(key, instance);
    }
  
    static getInstance<T>(key: string): T | undefined {
      return this.instances.get(key) as T | undefined;
    }
  
    static setInstance<T>(key: string, instance: T): void {
      this.instances.set(key, instance);
    }
}


/*

interface IService {
  execute(): void;
}

class ServiceOne implements IService {
  execute(): void {
    console.log("Executing ServiceOne");
  }
}

class ServiceTwo implements IService {
  execute(): void {
    console.log("Executing ServiceTwo");
  }
}

class ServiceLocator {
  private static instances: Map<string, any> = new Map();

  static register<T>(key: string, instance: T): void {
    this.instances.set(key, instance);
  }

  static getInstance<T>(key: string): T | undefined {
    return this.instances.get(key) as T | undefined;
  }

  static setInstance<T>(key: string, instance: T): void {
    this.instances.set(key, instance);
  }
}

// Usage example
ServiceLocator.register('ServiceOne', new ServiceOne());
ServiceLocator.register('ServiceTwo', new ServiceTwo());

const serviceOne = ServiceLocator.getInstance('ServiceOne');
const serviceTwo = ServiceLocator.getInstance('ServiceTwo');

if (serviceOne && serviceTwo) {
  serviceOne.execute();
  serviceTwo.execute();
}

// Update instance later
ServiceLocator.setInstance('ServiceOne', new ServiceOne());

*/