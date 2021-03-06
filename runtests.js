var BonsaiC = require('./bonsai-c');
var asmjs = require('asm.js');
var assert = require('assert');

var js, module;

function testCompile(filename, expectedResult, opts) {
	if (!opts) opts = {};

	console.log('running test: ' + filename);
	js = BonsaiC.compile(filename);

	if (!opts.skipValidate) {
		try {
			asmjs.validate(js);
		} catch(e) {
			console.log(filename + ' failed asm.js validation:');
			throw e;
		}
	}

	module = eval('(' + js + ')')();

	if (!opts.params) {
		assert.equal(expectedResult, module.main());
	} else {
		assert.equal(expectedResult, module.main.apply(null, opts.params));
	}

	var i;
	if (opts.shouldExport) {
		for (i = 0; i < opts.shouldExport.length; i++) {
			if (!(opts.shouldExport[i] in module)) {
				throw "Expected to find export: " + opts.shouldExport[i];
			}
		}
	}

	if (opts.shouldNotExport) {
		for (i = 0; i < opts.shouldNotExport.length; i++) {
			if (opts.shouldNotExport[i] in module) {
				throw "Name exported, but should not be: " + opts.shouldNotExport[i];
			}
		}
	}
}

testCompile('tests/fortytwo.c', 42);
testCompile('tests/add.c', 42);
testCompile('tests/var.c', 42);
testCompile('tests/initvar.c', 42);
testCompile('tests/param.c', 42, {params: [42]});
testCompile('tests/call.c', 42, {shouldExport: ['add']});
testCompile('tests/inner_block.c', 42);
testCompile('tests/while.c', 55);
testCompile('tests/variable_shadowing.c', 65);
testCompile('tests/for.c', 45);
testCompile('tests/if.c', 42);
testCompile('tests/if_no_else.c', 42);
testCompile('tests/double.c', 42);
testCompile('tests/logical_not.c', 0);
testCompile('tests/logical_and.c', 42);
testCompile('tests/logical_or.c', 42);
testCompile('tests/call_assign.c', 42);
testCompile('tests/double_var.c', 42);
testCompile('tests/double_add.c', 42);
testCompile('tests/chained_add.c', 42);
testCompile('tests/reserved_vars.c', 42);
testCompile('tests/empty_params.c', 42);
testCompile('tests/void_return.c', 42);
testCompile('tests/equal.c', 42);
testCompile('tests/break.c', 42);
testCompile('tests/for_without_test.c', 45);
testCompile('tests/for_without_init.c', 45);
testCompile('tests/for_without_update.c', 45);
testCompile('tests/continue.c', 42);
testCompile('tests/do_while.c', 55);
testCompile('tests/logical_shortcuts.c', 42);
testCompile('tests/double_mul.c', 42);
testCompile('tests/int_div.c', 42);
testCompile('tests/late_declaration.c', 52);
testCompile('tests/nonconstant_declare.c', 42);
testCompile('tests/comma.c', 42);
testCompile('tests/preincrement.c', 42);
testCompile('tests/predecrement.c', 42);
testCompile('tests/postincrement.c', 42);
testCompile('tests/postdecrement.c', 42);
testCompile('tests/int_mod.c', 42);
testCompile('tests/double_mod.c', 42);
testCompile('tests/double_to_signed.c', 42);
testCompile('tests/static_func.c', 42, {shouldNotExport: ['add']});
testCompile('tests/global_var.c', 42);
// testCompile('tests/calc.c', 42);

console.log("All tests passed");
