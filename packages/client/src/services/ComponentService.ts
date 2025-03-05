import Phaser from 'phaser';
import short from 'short-uuid';
import { IGameObject } from '@natewilcox/zelda-battle-shared';

export type Constructor<T extends {} = {}> = new (...args: any[]) => T;


/**
 * Interface for components
 */
export interface IComponent {

    init(go: Phaser.GameObjects.GameObject & IGameObject);

    awake?: () => void;
    start?: () => void;
    update?: (dt: number, t: number) => void;
    destroy?: () => void;
}


/**
 * Service to run components attached to game objects
 */
export default class ComponentService {


    private componentsByGameObject = new Map<number, IComponent[]>();
    private queuedForStart: IComponent[] = [];


    /**
     * Adding a component to a gameobject.
     * 
     * @param go 
     * @param component 
     */
    addComponent(go: Phaser.GameObjects.GameObject & IGameObject, component: IComponent) {

        // if(!go.id) {
        //     go.id = short.generate();
        // }

        if(!this.componentsByGameObject.has(go.id)) {
            this.componentsByGameObject.set(go.id, []);
        }

        const list = this.componentsByGameObject.get(go.id) as IComponent[];
        list.push(component);

        component.init(go);

        if(component.awake) {
            component.awake();
        }

        if(component.start) {
            this.queuedForStart.push(component);
        }
    }


    /**
     * Find a compoent by gameobject and type.
     * 
     * @param go 
     * @param componentType 
     * @returns 
     */
    findComponent<ComponentType>(go: Phaser.GameObjects.GameObject & IGameObject, componentType: Constructor<ComponentType>) {

        const components = this.componentsByGameObject.get(go.id);

        if(!components) {
            return null;
        }

        return components.find(component => component instanceof componentType);
    }

    destroyComponent<ComponentType>(go: Phaser.GameObjects.GameObject & IGameObject, componentType: Constructor<ComponentType>) {

        const componentsToDestory = this.findComponent(go, componentType)

        if(!componentsToDestory) {
            return null;
        }

        if(componentsToDestory.destroy) {
            componentsToDestory.destroy();
        }

        //find the index of the component to remove from go
        const i = this.componentsByGameObject.get(go.id)?.findIndex(c => c instanceof componentType);

        //if we found an index, remove it
        if(i != null) {
            this.componentsByGameObject.get(go.id)?.splice(i, 1);
        }
    }

    /**
     * Destroys the component service and all registered components.
     */
    destroy() {
        const entries = this.componentsByGameObject.entries();

        for(const [,components] of entries) {
            components.forEach(component => {

                if(component.destroy) {
                    component.destroy();
                }
            })
        }

        //create new eempty map
        this.componentsByGameObject = new Map<number, IComponent[]>();
    }


    /**
     * Iterates all components and calls update() method.
     * 
     * @param dt 
     * @param t 
     */
    update(dt: number, t: number) {

        while(this.queuedForStart.length > 0) {
            const component = this.queuedForStart.shift();

            if(component?.start) {
                component.start();
            }
        }

        const entries = this.componentsByGameObject.entries();

        //TODO create update list
        for(const [,components] of entries) {
            components.forEach(component => {

                if(component.update) {
                    component.update(dt, t);
                }
            })
        }
    }
}
