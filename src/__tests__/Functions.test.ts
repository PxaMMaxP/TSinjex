import { TSinjex } from 'src/classes/TSinjex';
import { register } from 'src/functions/register';
import { resolve } from 'src/functions/resolve';
import { test_RegisterFunction, test_ResolveFunction } from './Functions.spec';

test_RegisterFunction(TSinjex, register);
test_ResolveFunction(TSinjex, resolve);
