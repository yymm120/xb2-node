import assert from 'assert';
import { When, Then } from '@cucumber/cucumber';
import { Greeter } from '../../cucumberParallel/Example'

When ('the greeter say hello', function() {
 console.log('abc');
})